/**
 * 온보딩 페이지
 * PM/UX: 사용자 설정 프로세스
 * FE 리드: 폼 처리 및 검증
 */

'use client';

import React, { useState } from 'react';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { SimpleCalendar } from '@/app/components/SimpleCalendar';

interface Database {
  id: string;
  title: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loadingDatabases, setLoadingDatabases] = useState(false);
  
  const [formData, setFormData] = useState({
    databaseId: '',
    apiKey: '',
    dateProperty: '날짜',
    titleProperty: '제목',
    scheduleProperties: ['일정1', '일정2', '일정3', '일정4', '일정5'],
    importantProperty: '중요',
    primaryColor: '#4A5568',
    accentColor: '#ED64A6',
    importantColor: '#ED64A6',
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 100,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSchedulePropertyChange = (index: number, value: string) => {
    const newProperties = [...formData.scheduleProperties];
    newProperties[index] = value;
    setFormData(prev => ({ ...prev, scheduleProperties: newProperties }));
  };

  const validateStep1 = async () => {
    if (!formData.apiKey.trim()) {
      setError('Notion API 키를 입력해주세요.');
      return false;
    }
    
    // API 키로 데이터베이스 목록 가져오기
    if (databases.length === 0) {
      setLoadingDatabases(true);
      setError(null);
      
      try {
        const response = await fetch('/api/databases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: formData.apiKey }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          setError('API 키가 올바르지 않거나 연결에 실패했습니다.');
          return false;
        }
        
        if (data.data.length === 0) {
          setError('연결된 데이터베이스가 없습니다. Notion에서 Integration을 데이터베이스에 연결해주세요.');
          return false;
        }
        
        setDatabases(data.data);
      } catch {
        setError('데이터베이스 목록을 불러오는 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoadingDatabases(false);
      }
    }
    
    // 데이터베이스가 선택되었는지 확인
    if (!formData.databaseId.trim()) {
      setError('데이터베이스를 선택해주세요.');
      return false;
    }
    
    // 데이터베이스 스키마 자동 분석
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          apiKey: formData.apiKey,
          databaseId: formData.databaseId 
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError('데이터베이스 스키마를 분석할 수 없습니다: ' + data.error.details);
        return false;
      }
      
      // 자동으로 속성 매칭
      setFormData(prev => ({
        ...prev,
        dateProperty: data.data.dateProperty,
        titleProperty: data.data.titleProperty,
        scheduleProperties: data.data.scheduleProperties,
        importantProperty: data.data.importantProperty,
      }));
      
    } catch {
      setError('데이터베이스 분석 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.dateProperty.trim()) {
      setError('날짜 속성명을 입력해주세요.');
      return false;
    }
    if (!formData.titleProperty.trim()) {
      setError('제목 속성명을 입력해주세요.');
      return false;
    }
    if (formData.scheduleProperties.filter(p => p.trim()).length === 0) {
      setError('최소 하나의 일정 속성을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await validateStep1();
      if (!isValid) return;
      // Step 2를 건너뛰고 바로 Step 3(테마 설정)으로
      setStep(3);
      return;
    }
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setError(null);
  };

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 미리보기용 간단한 설정 생성
      const simpleConfig = {
        token: formData.apiKey,
        dbId: formData.databaseId,
        dateProp: formData.dateProperty,
        titleProp: formData.titleProperty,
        scheduleProps: formData.scheduleProperties.filter(p => p.trim()),
        importantProp: formData.importantProperty,
        primaryColor: formData.primaryColor,
        accentColor: formData.accentColor,
        importantColor: formData.importantColor,
        backgroundColor: formData.backgroundColor,
        backgroundOpacity: formData.backgroundOpacity,
      };
      
        // Base64 인코딩하여 미리보기 URL 생성 (URL-safe, UTF-8 지원)
        const jsonString = JSON.stringify(simpleConfig);
        const utf8Bytes = new TextEncoder().encode(jsonString);
        const base64String = btoa(String.fromCharCode(...utf8Bytes))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
        const encodedConfig = base64String;
      
      // Production URL 사용 - 항상 고정된 URL 사용
      const baseUrl = 'https://cal-widget01.vercel.app';
      const previewUrl = `${baseUrl}/u/${encodedConfig}`;
      
      setEmbedUrl(previewUrl);
      setPreviewMode(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '미리보기 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notionConfig: {
            apiKey: formData.apiKey,
            databaseId: formData.databaseId,
            dateProperty: formData.dateProperty,
            titleProperty: formData.titleProperty,
            scheduleProperties: formData.scheduleProperties.filter(p => p.trim()),
            importantProperty: formData.importantProperty,
          },
          theme: {
            primaryColor: formData.primaryColor,
            accentColor: formData.accentColor,
            importantColor: formData.importantColor,
            backgroundColor: formData.backgroundColor,
            backgroundOpacity: formData.backgroundOpacity,
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || '설정 저장 실패');
      }
      
      setEmbedUrl(data.data.embedUrl);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : '설정 저장 실패');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="처리 중..." />;
  }

  return (
    <div className="onboarding-container">
      <style jsx>{`
        .onboarding-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        h1 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #718096;
        }
        
        .step-indicator {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0.5rem;
          font-weight: 600;
          transition: all 0.3s;
        }
        
        .step.active {
          background: #4a5568;
          color: white;
        }
        
        .step.completed {
          background: #48bb78;
          color: white;
        }
        
        .step.inactive {
          background: #e2e8f0;
          color: #a0aec0;
        }
        
        .card {
          background: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }
        
        input, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          font-size: 1rem;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #4a5568;
          box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.1);
        }
        
        input[type="color"] {
          height: 40px;
          cursor: pointer;
        }
        
        select {
          cursor: pointer;
          background-color: white;
        }
        
        input:disabled, select:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }
        
        .help-text {
          font-size: 0.875rem;
          color: #718096;
          margin-top: 0.25rem;
        }
        
        .error-message {
          background: #fff5f5;
          border: 1px solid #feb2b2;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 0.25rem;
          margin-bottom: 1rem;
        }
        
        .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #4a5568;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background: #2d3748;
        }
        
        .btn-secondary {
          background: white;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }
        
        .btn-secondary:hover {
          background: #f7fafc;
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .success-card {
          text-align: center;
        }
        
        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .embed-code-container {
          position: relative;
          margin: 1.5rem 0;
        }
        
        .embed-code {
          background: #f7fafc;
          padding: 1rem;
          padding-right: 5rem;
          border-radius: 0.25rem;
          border: 2px solid #e2e8f0;
          font-family: monospace;
          font-size: 0.875rem;
          word-break: break-all;
          line-height: 1.6;
        }
        
        .copy-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #4a5568;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .copy-button:hover {
          background: #2d3748;
        }
        
        .copy-button:active {
          transform: scale(0.95);
        }
        
        .preview-container {
          margin-top: 2rem;
        }
        
        .preview-section {
          margin: 1.5rem 0;
        }
        
        .widget-preview {
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
        }
        
        .widget-preview iframe {
          display: block;
        }
        
        @media (max-width: 640px) {
          .onboarding-container {
            padding: 1rem;
          }
          
          .card {
            padding: 1.5rem;
          }
        }
      `}</style>
      
      <div className="header">
        <h1>심플 캘린더 위젯 설정</h1>
        <p className="subtitle">Notion 데이터베이스와 연결하여 캘린더를 생성합니다</p>
      </div>
      
      {step < 4 && (
        <div className="step-indicator">
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : 'inactive'}`}>
            1
          </div>
          <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : 'inactive'}`}>
            2
          </div>
        </div>
      )}
      
      <div className="card">
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        
        {step === 1 && (
          <>
            <h2>Step 1: Notion 연결</h2>
            <div className="form-group">
              <label htmlFor="apiKey">Notion API 키</label>
              <input
                id="apiKey"
                type="password"
                value={formData.apiKey}
                onChange={(e) => {
                  handleInputChange('apiKey', e.target.value);
                  setDatabases([]);
                  setFormData(prev => ({ ...prev, databaseId: '' }));
                }}
                placeholder="secret_..."
                disabled={loadingDatabases}
              />
              <p className="help-text">
                Notion Integration에서 발급받은 API 키를 입력하세요.
              </p>
            </div>
            
            {databases.length > 0 && (
              <div className="form-group">
                <label htmlFor="databaseSelect">데이터베이스 선택</label>
                <select
                  id="databaseSelect"
                  value={formData.databaseId}
                  onChange={(e) => handleInputChange('databaseId', e.target.value)}
                  className="database-select"
                >
                  <option value="">데이터베이스를 선택하세요</option>
                  {databases.map((db) => (
                    <option key={db.id} value={db.id}>
                      {db.title}
                    </option>
                  ))}
                </select>
                <p className="help-text">
                  {databases.length}개의 데이터베이스를 찾았습니다.
                </p>
              </div>
            )}
            
            <div className="button-group">
              <div />
              <button 
                className="btn-primary" 
                onClick={handleNextStep}
                disabled={loadingDatabases}
              >
                {loadingDatabases ? '불러오는 중...' : databases.length > 0 ? '다음' : '데이터베이스 불러오기'}
              </button>
            </div>
          </>
        )}
        
        {step === 2 && (
          <>
            <h2>Step 2: 속성 설정</h2>
            <div className="form-group">
              <label htmlFor="dateProperty">날짜 속성명</label>
              <input
                id="dateProperty"
                type="text"
                value={formData.dateProperty}
                onChange={(e) => handleInputChange('dateProperty', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="titleProperty">제목 속성명</label>
              <input
                id="titleProperty"
                type="text"
                value={formData.titleProperty}
                onChange={(e) => handleInputChange('titleProperty', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>일정 속성명 (최대 5개)</label>
              {formData.scheduleProperties.map((prop, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={prop}
                  onChange={(e) => handleSchedulePropertyChange(idx, e.target.value)}
                  placeholder={`일정${idx + 1}`}
                  style={{ marginBottom: '0.5rem' }}
                />
              ))}
            </div>
            
            <div className="form-group">
              <label htmlFor="importantProperty">중요 표시 속성명</label>
              <input
                id="importantProperty"
                type="text"
                value={formData.importantProperty}
                onChange={(e) => handleInputChange('importantProperty', e.target.value)}
              />
            </div>
            
            <div className="button-group">
              <button className="btn-secondary" onClick={handlePreviousStep}>
                이전
              </button>
              <button className="btn-primary" onClick={handleNextStep}>
                다음
              </button>
            </div>
          </>
        )}
        
        {step === 3 && (
          <>
            <h2>Step 2: 테마 설정</h2>
            <div className="form-group">
              <label htmlFor="primaryColor">기본 색상</label>
              <input
                id="primaryColor"
                type="color"
                value={formData.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accentColor">강조 색상</label>
              <input
                id="accentColor"
                type="color"
                value={formData.accentColor}
                onChange={(e) => handleInputChange('accentColor', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="importantColor">중요 일정 색상</label>
              <input
                id="importantColor"
                type="color"
                value={formData.importantColor}
                onChange={(e) => handleInputChange('importantColor', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="backgroundColor">배경 색상</label>
              <input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="backgroundOpacity">배경 투명도: {formData.backgroundOpacity}%</label>
              <input
                id="backgroundOpacity"
                type="range"
                min="0"
                max="100"
                value={formData.backgroundOpacity}
                onChange={(e) => handleInputChange('backgroundOpacity', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            {previewMode && (
              <div className="preview-container">
                <h3>미리보기</h3>
                <SimpleCalendar
                  configId="preview"
                  theme={{
                    primaryColor: formData.primaryColor,
                    accentColor: formData.accentColor,
                    importantColor: formData.importantColor,
                    backgroundColor: formData.backgroundColor,
                    backgroundOpacity: formData.backgroundOpacity,
                  }}
                />
              </div>
            )}
            
            <div className="button-group">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                이전
              </button>
              <div>
                <button 
                  className="btn-secondary" 
                  onClick={handlePreview}
                  style={{ marginRight: '0.5rem' }}
                >
                  미리보기
                </button>
                <button className="btn-primary" onClick={handleSubmit}>
                  완료
                </button>
              </div>
            </div>
          </>
        )}
        
        {step === 4 && (
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>설정 완료!</h2>
            <p>아래 코드를 복사하여 Notion 페이지에 붙여넣기하세요.</p>
            
            <div className="preview-section">
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#2d3748' }}>미리보기</h3>
              <div className="widget-preview">
                <iframe 
                  src={embedUrl} 
                  width="100%" 
                  height="400" 
                  frameBorder="0"
                  title="위젯 미리보기"
                />
              </div>
            </div>
            
            <div className="embed-code-container">
              <div className="embed-code">
                {embedUrl}
              </div>
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(embedUrl);
                  alert('URL이 클립보드에 복사되었습니다!');
                }}
              >
                📋 URL 복사
              </button>
            </div>
            
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: '#f0f9ff', 
              borderRadius: '8px',
              border: '1px solid #0ea5e9'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0369a1' }}>
                📌 Notion에 추가하는 방법:
              </p>
              <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#0c4a6e' }}>
                <li>Notion 페이지에서 <code>/embed</code> 입력</li>
                <li>위 URL 붙여넣기</li>
                <li>&quot;링크 임베드&quot; 선택</li>
                <li>위젯이 표시됩니다!</li>
              </ol>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                ⚠️ 북마크로 표시되면: 북마크 위에서 우클릭 → &quot;미리보기 표시&quot; 선택
              </p>
            </div>
            
            <button
              className="btn-primary"
              onClick={() => window.open(embedUrl, '_blank')}
              style={{ marginTop: '1rem' }}
            >
              새 창에서 열기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

