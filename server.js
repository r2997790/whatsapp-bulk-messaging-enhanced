const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

let qrCodeData = null;
let isClientReady = false;
let messageStats = { sent: 0, failed: 0, total: 0 };

// In-memory storage for templates and contacts (in production, use a database)
let templates = [
  {
    id: 1,
    name: 'Welcome Message',
    content: 'Hello {{name}}, welcome to our service! We\'re excited to have you with us.',
    variables: ['name'],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Reminder',
    content: 'Hi {{name}}, this is a friendly reminder about {{event}} scheduled for {{date}}.',
    variables: ['name', 'event', 'date'],
    createdAt: new Date().toISOString()
  }
];

let contacts = [
  {
    id: 1,
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    tags: ['customer', 'vip'],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '0987654321',
    email: 'jane@example.com',
    tags: ['prospect'],
    createdAt: new Date().toISOString()
  }
];

let contactGroups = [
  {
    id: 1,
    name: 'VIP Customers',
    description: 'High-value customers',
    contacts: [1],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Prospects',
    description: 'Potential customers',
    contacts: [2],
    createdAt: new Date().toISOString()
  }
];

// WhatsApp client events
client.on('qr', async (qr) => {
  console.log('QR Code received');
  qrCodeData = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  isClientReady = true;
  qrCodeData = null;
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
  isClientReady = false;
  qrCodeData = null;
});

// Initialize client
client.initialize();

// Utility functions
function replaceTemplateVariables(template, variables) {
  let content = template.content;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, variables[key]);
  });
  return content;
}

function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.includes('@') ? cleaned : cleaned + '@c.us';
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', (req, res) => {
  res.json({
    isReady: isClientReady,
    qrCode: qrCodeData,
    stats: messageStats
  });
});

// Template routes
app.get('/api/templates', (req, res) => {
  res.json(templates);
});

app.post('/api/templates', (req, res) => {
  const { name, content, variables } = req.body;
  const template = {
    id: Date.now(),
    name,
    content,
    variables: variables || [],
    createdAt: new Date().toISOString()
  };
  templates.push(template);
  res.json(template);
});

app.put('/api/templates/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index] = { ...templates[index], ...req.body };
    res.json(templates[index]);
  } else {
    res.status(404).json({ error: 'Template not found' });
  }
});

app.delete('/api/templates/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Template not found' });
  }
});

// Contact routes
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, phone, email, tags } = req.body;
  const contact = {
    id: Date.now(),
    name,
    phone,
    email,
    tags: tags || [],
    createdAt: new Date().toISOString()
  };
  contacts.push(contact);
  res.json(contact);
});

app.put('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...req.body };
    res.json(contacts[index]);
  } else {
    res.status(404).json({ error: 'Contact not found' });
  }
});

app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Contact not found' });
  }
});

// Group routes
app.get('/api/groups', (req, res) => {
  res.json(contactGroups);
});

app.post('/api/groups', (req, res) => {
  const { name, description, contacts } = req.body;
  const group = {
    id: Date.now(),
    name,
    description,
    contacts: contacts || [],
    createdAt: new Date().toISOString()
  };
  contactGroups.push(group);
  res.json(group);
});

app.put('/api/groups/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contactGroups.findIndex(g => g.id === id);
  if (index !== -1) {
    contactGroups[index] = { ...contactGroups[index], ...req.body };
    res.json(contactGroups[index]);
  } else {
    res.status(404).json({ error: 'Group not found' });
  }
});

app.delete('/api/groups/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contactGroups.findIndex(g => g.id === id);
  if (index !== -1) {
    contactGroups.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Group not found' });
  }
});

// Message sending routes
app.post('/send-message', upload.single('attachment'), async (req, res) => {
  if (!isClientReady) {
    return res.status(400).json({ error: 'WhatsApp client is not ready' });
  }

  try {
    const { phone, message, templateId, templateVariables } = req.body;
    let phoneNumbers = [];
    
    if (phone.includes(',')) {
      phoneNumbers = phone.split(',').map(p => p.trim());
    } else {
      phoneNumbers = [phone];
    }

    let messageContent = message;
    
    // If using template
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        const variables = templateVariables ? JSON.parse(templateVariables) : {};
        messageContent = replaceTemplateVariables(template, variables);
      }
    }

    messageStats.total = phoneNumbers.length;
    messageStats.sent = 0;
    messageStats.failed = 0;

    let media = null;
    if (req.file) {
      media = MessageMedia.fromFilePath(req.file.path);
    }

    const results = [];
    
    for (const phoneNumber of phoneNumbers) {
      try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        
        if (media) {
          await client.sendMessage(formattedNumber, media, { caption: messageContent });
        } else {
          await client.sendMessage(formattedNumber, messageContent);
        }
        
        messageStats.sent++;
        results.push({ phone: phoneNumber, status: 'sent' });
        
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send to ${phoneNumber}:`, error);
        messageStats.failed++;
        results.push({ phone: phoneNumber, status: 'failed', error: error.message });
      }
    }

    // Clean up uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      results,
      stats: messageStats
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bulk message with template
app.post('/send-bulk-template', async (req, res) => {
  if (!isClientReady) {
    return res.status(400).json({ error: 'WhatsApp client is not ready' });
  }

  try {
    const { templateId, recipients } = req.body;
    
    const template = templates.find(t => t.id === parseInt(templateId));
    if (!template) {
      return res.status(400).json({ error: 'Template not found' });
    }

    messageStats.total = recipients.length;
    messageStats.sent = 0;
    messageStats.failed = 0;

    const results = [];
    
    for (const recipient of recipients) {
      try {
        const messageContent = replaceTemplateVariables(template, recipient.variables || {});
        const formattedNumber = formatPhoneNumber(recipient.phone);
        
        await client.sendMessage(formattedNumber, messageContent);
        
        messageStats.sent++;
        results.push({ phone: recipient.phone, status: 'sent' });
        
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send to ${recipient.phone}:`, error);
        messageStats.failed++;
        results.push({ phone: recipient.phone, status: 'failed', error: error.message });
      }
    }

    res.json({
      success: true,
      results,
      stats: messageStats
    });

  } catch (error) {
    console.error('Send bulk template error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});