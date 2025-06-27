# Enhanced WhatsApp Messaging Platform

A comprehensive WhatsApp bulk messaging application with templates, contact management, and modern UI design.

## 🚀 Live Demo

**Deployed URL:** https://whatsapp-enhanced-v2-production.up.railway.app/

## ✨ Features

### 🎯 Core Messaging
- **Single Message**: Send messages to individual contacts
- **Bulk Messaging**: Send to multiple contacts simultaneously
- **File Attachments**: Support for images, PDFs, and documents
- **Real-time Progress**: Live progress tracking and statistics

### 📝 Template Management
- **Create Templates**: Design reusable message templates
- **Variable Support**: Use dynamic variables like {{name}}, {{date}}, etc.
- **Template Library**: Manage and organize all your templates
- **Quick Selection**: Easy template selection during messaging

### 📞 Contact Management
- **Contact Database**: Store and organize contact information
- **Tagging System**: Categorize contacts with custom tags
- **Import/Export**: Easy contact management
- **Search & Filter**: Find contacts quickly

### 👥 Group Management
- **Contact Groups**: Organize contacts into targeted groups
- **Bulk Group Messaging**: Send to entire groups at once
- **Group Analytics**: Track group engagement
- **Dynamic Groups**: Add/remove contacts from groups

### 📊 Analytics & Reporting
- **Message Statistics**: Track sent, failed, and total messages
- **Success Rates**: Monitor delivery performance
- **Template Usage**: See which templates perform best
- **Contact Engagement**: Track contact interactions

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Modern, translucent interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Customizable appearance
- **Smooth Animations**: Engaging user interactions
- **Intuitive Navigation**: Easy-to-use sidebar navigation

## 🛠️ Technology Stack

- **Backend**: Node.js + Express
- **WhatsApp Integration**: whatsapp-web.js
- **File Upload**: Multer
- **QR Code Generation**: qrcode
- **Frontend**: Vanilla JavaScript + CSS3
- **Styling**: Custom CSS with modern effects
- **Icons**: Font Awesome 6

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/r2997790/whatsapp-bulk-messaging-enhanced.git
   cd whatsapp-bulk-messaging-enhanced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Deployment

#### Railway (Recommended)
1. Fork this repository
2. Connect to Railway
3. Deploy automatically
4. Set environment variables if needed

#### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Usage Guide

### 1. Initial Setup
1. Open the application in your browser
2. Scan the QR code with WhatsApp on your phone
3. Wait for connection confirmation

### 2. Creating Templates
1. Navigate to "Templates" section
2. Click "New Template"
3. Enter template name and content
4. Use `{{variable}}` syntax for dynamic content
5. Save template

### 3. Managing Contacts
1. Go to "Contacts" section
2. Click "New Contact" 
3. Fill in contact details
4. Add tags for organization
5. Save contact

### 4. Creating Groups
1. Visit "Groups" section
2. Click "New Group"
3. Enter group name and description
4. Select contacts to include
5. Save group

### 5. Sending Messages
1. Choose message type (Single/Bulk)
2. Enter phone numbers or select contacts
3. Choose template (optional)
4. Fill in template variables if needed
5. Add attachments if desired
6. Send message

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                    # Server port
NODE_ENV=production         # Environment
```

### File Upload Limits
- Max file size: 10MB
- Supported formats: JPG, PNG, PDF, DOC, DOCX

### Rate Limiting
- Message delay: 1 second between messages
- Prevents WhatsApp blocking/rate limiting

### Data Storage
- Templates: In-memory (production should use database)
- Contacts: In-memory (production should use database)
- Groups: In-memory (production should use database)

## 🔒 Security Features

- File type validation
- Input sanitization
- CSRF protection
- Secure file uploads
- Path traversal prevention

## 📊 API Endpoints

### Templates
- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Groups
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create new group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Messaging
- `POST /send-message` - Send single/bulk message
- `POST /send-bulk-template` - Send bulk message with template
- `GET /status` - Get WhatsApp connection status

## 🚨 Troubleshooting

### Common Issues

1. **QR Code not appearing**
   - Check internet connection
   - Refresh the page
   - Clear browser cache

2. **Messages not sending**
   - Verify WhatsApp connection
   - Check phone number format
   - Ensure WhatsApp is not rate limiting

3. **File upload errors**
   - Check file size (max 10MB)
   - Verify file format is supported
   - Ensure sufficient disk space

4. **Connection drops frequently**
   - Stable internet connection required
   - Keep WhatsApp phone app active
   - Avoid logging out of WhatsApp

### Phone Number Format
- Include country code without + symbol
- Example: 1234567890 (for +1 234 567 890)
- No spaces, dashes, or special characters

## 🔄 Updates & Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor WhatsApp Web changes
- Update security patches

### Backup Recommendations
- Export contacts regularly
- Save important templates
- Monitor message logs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

- This tool is for legitimate business use only
- Respect WhatsApp's Terms of Service
- Obtain consent before sending bulk messages
- Use responsibly to avoid account restrictions

## 🆘 Support

- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

## 🎯 Roadmap

### Upcoming Features
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] CSV import/export for contacts
- [ ] Advanced analytics dashboard
- [ ] Scheduled messaging
- [ ] Message templates with rich media
- [ ] Multi-user support
- [ ] API rate limiting
- [ ] Webhook integration
- [ ] Auto-reply functionality
- [ ] Contact segmentation

### Version History
- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added templates and contact management
- **v1.2.0** - Enhanced UI and group management
- **v1.3.0** - Analytics and improved error handling

---

## 🌟 Screenshots

### Main Dashboard
Modern glassmorphism design with intuitive navigation

### Template Management
Create and manage reusable message templates with variables

### Contact Management
Organize contacts with tags and detailed information

### Group Management
Create contact groups for targeted messaging

### Analytics Dashboard
Track messaging performance and statistics

---

**Built with ❤️ for efficient WhatsApp messaging**