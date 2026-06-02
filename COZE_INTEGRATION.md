# Coze Chatbox Integration Guide

## Overview

Your Coze chatbox has been integrated as a floating widget on all pages of your website. The widget appears as a circular button in the bottom-right corner and opens a chat interface when clicked.

## Files Created/Modified

### New Components
- **`components/coze-chatbox.tsx`** - Main chat interface component
- **`components/coze-chat-widget.tsx`** - Floating widget wrapper
- **`app/api/coze/route.ts`** - Backend API route for Coze integration
- **`.env.local`** - Environment configuration file

### Modified Files
- **`app/layout.tsx`** - Added CozeChatWidget to global layout

## Setup Instructions

### Step 1: Get Your Coze Credentials

1. Visit [Coze Platform](https://www.coze.com/)
2. Create or select your bot
3. Go to your bot settings to find:
   - **Bot ID** - Unique identifier for your bot
   - **API Key** - Authentication token for API calls

### Step 2: Configure Environment Variables

1. Open `.env.local` file
2. Replace the placeholder values:

```env
COZE_BOT_ID=your_actual_bot_id
COZE_API_KEY=your_actual_api_key
```

3. Save the file (never commit `.env.local` to version control)

### Step 3: Test the Integration

1. Run your development server: `npm run dev` or `pnpm dev`
2. Open your website in a browser
3. Look for the blue circular button in the bottom-right corner
4. Click it to open the chatbox
5. Send a test message to verify it connects to Coze

## Features

✅ **Global Floating Widget** - Available on all pages
✅ **Vietnamese Support** - Full Vietnamese language support
✅ **Responsive Design** - Works on desktop and mobile
✅ **Design System Integration** - Matches your website's Radix UI + Tailwind styling
✅ **Dark Mode Support** - Automatically adapts to dark theme
✅ **Loading States** - Shows "Đang gõ..." while waiting for responses
✅ **Error Handling** - Graceful error messages in Vietnamese

## Customization

### Change Widget Position
Edit `components/coze-chat-widget.tsx`:
```tsx
<div className="fixed bottom-6 right-6 z-50"> {/* Adjust bottom-6 right-6 */}
```

### Change Chat Window Size
Edit `components/coze-chat-widget.tsx`:
```tsx
<div className="w-96 h-screen max-h-96"> {/* Adjust w-96 max-h-96 */}
```

### Change Greeting Message
Edit `components/coze-chatbox.tsx`:
```tsx
text: "Xin chào! 👋 Your custom message here"
```

### Change Colors/Styling
The widget uses your existing design tokens:
- Primary color: `from-primary/20`
- Accent color: `to-accent/10`
- Edit values in `components/coze-chatbox.tsx` classes

## API Integration Details

The `/api/coze` endpoint:
- Accepts POST requests with `message` and `conversation_id`
- Forwards requests to Coze API
- Returns bot responses
- Handles errors gracefully

### API Request Format
```json
{
  "message": "Your question here",
  "conversation_id": "default"
}
```

### API Response Format
```json
{
  "reply": "Bot response here"
}
```

## Troubleshooting

### Issue: "Chatbot is not properly configured"
**Solution:** Ensure `COZE_BOT_ID` and `COZE_API_KEY` are set in `.env.local`

### Issue: Button doesn't appear
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Messages not sending
**Solution:** 
- Check browser console for errors
- Verify API keys are correct
- Ensure Coze bot is properly published

### Issue: Vietnamese text shows incorrectly
**Solution:** Already supported by Noto Sans font in your layout

## Advanced Features (Optional)

### Store User Conversations
Modify `api/coze/route.ts` to store conversations in Supabase:
```typescript
// Add conversation storage logic here
```

### Add User Authentication
Update `coze-chatbox.tsx` to pass user ID:
```typescript
user_id: getCurrentUserId() // Instead of "anonymous"
```

### Add Typing Indicators
Already implemented with the "Đang gõ..." loader

## Next Steps

1. ✅ Add Coze credentials to `.env.local`
2. ✅ Test the chatbox
3. ✅ Customize appearance if needed
4. ✅ Deploy to production

## Support

For Coze API documentation: https://www.coze.com/docs
For Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
