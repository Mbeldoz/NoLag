const rateLimitMap = new Map();

export function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  const windowMs = 10 * 1000;
  const maxRequests = 10; 

  if (rateLimitMap.has(ip)) {
    const data = rateLimitMap.get(ip);
    const recentRequests = data.filter((timestamp) => now - timestamp < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return new Response('Too Many Requests', { status: 429 });
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
  } else {
    rateLimitMap.set(ip, [now]);
  }

  return NextResponse.next();
}


export const config = {
  matcher: '/',
};
