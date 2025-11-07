/**
 * API Proxy Route
 * Proxies requests to the backend API to avoid CORS issues in development
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fastapi-production-2b94.up.railway.app'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'DELETE')
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    // Build target URL
    const pathString = path.join('/')
    const searchParams = request.nextUrl.searchParams.toString()
    const targetUrl = `${API_BASE_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`

    console.log(`[Proxy] ${method} ${targetUrl}`)

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Copy authorization header if present
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
    }

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      try {
        const body = await request.text()
        if (body) {
          options.body = body
        }
      } catch (error) {
        console.error('[Proxy] Error reading request body:', error)
      }
    }

    // Make the request to backend
    const response = await fetch(targetUrl, options)

    // Get response data
    const data = await response.text()

    // Log errors from backend
    if (!response.ok) {
      console.error(`[Proxy] Backend error ${response.status}:`, {
        url: targetUrl,
        status: response.status,
        statusText: response.statusText,
        data: data.substring(0, 500) // Log first 500 chars of error response
      })
    }

    // Return response with same status
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('[Proxy] Error:', {
      url: `${API_BASE_URL}/${path.join('/')}`,
      error: String(error),
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json(
      {
        error: 'Proxy request failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
