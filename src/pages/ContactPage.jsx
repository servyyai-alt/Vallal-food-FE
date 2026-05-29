import { useState } from 'react';
import { FiMail, FiPhone, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createSupportMessage } from '../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await createSupportMessage(form);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-12">
        <p className="text-primary-600 font-semibold text-sm mb-2">Get in Touch</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">We're Here to Help</h1>
        <p className="text-gray-500 max-w-md mx-auto">Have a question or need support? Our friendly team is always ready to assist you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { icon: <FiMail className="w-6 h-6" />, title: 'Email Us', detail: 'vallalfoods@gmail.com', sub: 'We reply within 24 hours' },
          { icon: <FiPhone className="w-6 h-6" />, title: 'Call Us', detail: '+91 98422 09470', sub: 'Toll-free support line' },
          { icon: <FiClock className="w-6 h-6" />, title: 'Working Hours', detail: 'Mon – Sat', sub: '8:00 AM – 8:00 PM IST' }
        ].map((item, i) => (
          <div key={i} className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-4">{item.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-primary-600 font-semibold text-sm mb-0.5">{item.detail}</p>
            <p className="text-gray-400 text-xs">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="card p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
            <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field" required>
              <option value="">Select a topic</option>
              <option>Order Issue</option>
              <option>Product Quality</option>
              <option>Delivery Problem</option>
              <option>Payment Issue</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
            <textarea rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Describe your issue or question in detail..." className="input-field resize-none" />
          </div>
          <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2 py-3 px-8">
            <FiSend /> {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
