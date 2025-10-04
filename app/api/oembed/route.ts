import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // oEmbed 응답 생성
  const oembedResponse = {
    type: 'rich',
    version: '1.0',
    title: 'Calendar Widget',
    author_name: 'Calendar Widget',
    provider_name: 'Calendar Widget',
    provider_url: 'https://cal-widget01.vercel.app',
    html: `<iframe src="${url}" width="100%" height="450" frameborder="0" style="border-radius: 8px;"></iframe>`,
    width: 800,
    height: 450,
    thumbnail_url: 'https://cal-widget01.vercel.app/og-image.png',
    thumbnail_width: 800,
    thumbnail_height: 450,
  };

  return NextResponse.json(oembedResponse, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
