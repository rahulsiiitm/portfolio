import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Server-side validation
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Prepare data for Web3Forms
    const web3FormData = new FormData();
    web3FormData.append('access_key', process.env.WEB3FORMS_ACCESS_KEY || '');
    web3FormData.append('subject', 'New Message from Rahul\'s Portfolio');
    web3FormData.append('name', formData.name);
    web3FormData.append('email', formData.email);
    web3FormData.append('message', formData.message);

    // Submit to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: web3FormData,
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Transmission Successful. We\'ll be in touch.' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Connection Failed. Retrying...' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Network Error. Check connectivity.' },
      { status: 500 }
    );
  }
}