import React, { useState } from 'react';

const WaitlistBlock = () => {
  // 1. State for form data and submission status
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // ✅ CHANGED: Connected to your Live Render Backend
      const response = await fetch('https://skincache-2-0.onrender.com/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle specific errors (like duplicate email)
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      // Success!
      setStatus('success');
      setFormData({ name: '', email: '' }); // Clear form
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('error');
      // Added specific note about Render "Cold Start" for you to see in logs if it fails
      setErrorMessage("Email likely already exists or server is waking up (wait 30s and try again).");
    }
  };

  return (
    <section id="waitlist" className="bg-brand-lilac px-4 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl md:px-6 lg:px-0">
        <h2 className="text-center font-heading text-3xl text-brand-dark md:text-4xl">
          Waitlist Block
        </h2>
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-brand-dark px-6 py-8 shadow-[0_25px_70px_-45px_rgba(26,11,46,0.8)] md:mt-10 md:px-10 md:py-12">
          
          <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:items-center md:gap-12">
            {/* Left Side: Text */}
            <div className="space-y-4 text-white">
              <h3 className="font-heading text-3xl">Join the Revolution</h3>
              <p className="text-white/70">
                Skincache isn&apos;t just a platform; it&apos;s the bridge between clinical
                dermatology and your daily routine. We believe your skin deserves science, not just
                marketing.
              </p>
            </div>

            {/* Right Side: Form or Success Message */}
            <div className="w-full">
              {status === 'success' ? (
                // SUCCESS STATE UI
                <div className="bg-white/10 rounded-3xl p-8 text-center border border-brand-gold-start/30 animate-in fade-in zoom-in">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">You're on the list!</h4>
                  <p className="text-white/70">Watch your inbox for exclusive updates.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm text-brand-gold-start underline hover:text-white transition-colors"
                  >
                    Add another email
                  </button>
                </div>
              ) : (
                // FORM STATE UI
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-brand-gold-start focus:outline-none focus:ring-1 focus:ring-brand-gold-start transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-brand-gold-start focus:outline-none focus:ring-1 focus:ring-brand-gold-start transition-all"
                    />
                  </div>
                  
                  {status === 'error' && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-200 text-center">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="button-gold w-full disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {status === 'loading' ? (
                       <>
                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></span>
                         Joining...
                       </>
                    ) : 'Join Waitlist'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-brand-gold-start/15 via-transparent to-brand-gold-end/15 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default WaitlistBlock;