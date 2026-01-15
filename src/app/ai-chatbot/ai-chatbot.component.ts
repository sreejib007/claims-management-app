import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface ChatMessage {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'claim-card' | 'stats' | 'action-buttons';
  data?: any;
}

interface QuickAction {
  label: string;
  icon: string;
  query: string;
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.css'
})
export class AiChatbotComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  messages: ChatMessage[] = [
    {
      id: 1,
      content: 'Hello! I\'m your AI Claims Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ];

  userInput = '';
  isTyping = false;
  private messageIdCounter = 2;

  quickActions: QuickAction[] = [
    { label: 'Check Claim Status', icon: 'pi pi-search', query: 'Check my claim status' },
    { label: 'File New Claim', icon: 'pi pi-plus', query: 'I want to file a new claim' },
    { label: 'View My Policies', icon: 'pi pi-folder', query: 'Show my policies' },
    { label: 'Get Help', icon: 'pi pi-question-circle', query: 'I need help' }
  ];

  // Hardcoded sample data for demo
  private sampleClaims = [
    { id: 'CLM-2024-001', status: 'In Review', type: 'Motor', amount: '£2,500', date: '10 Jan 2024', handler: 'Sarah Johnson' },
    { id: 'CLM-2024-002', status: 'New', type: 'Home', amount: '£1,800', date: '12 Jan 2024', handler: 'Unassigned' },
    { id: 'CLM-2024-003', status: 'Approved', type: 'Motor', amount: '£3,200', date: '08 Jan 2024', handler: 'Mike Chen' }
  ];

  private samplePolicies = [
    { id: 'POL-MTR-104983', type: 'Motor', status: 'Active', expires: '15 Mar 2025', premium: '£450/year' },
    { id: 'POL-HOM-220771', type: 'Home', status: 'Active', expires: '22 Oct 2026', premium: '£380/year' }
  ];

  private dashboardStats = {
    totalClaims: 12,
    pendingClaims: 3,
    approvedClaims: 7,
    avgProcessingTime: '4.2 days'
  };

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: this.messageIdCounter++,
      content: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const userQuery = this.userInput;
    this.userInput = '';
    this.isTyping = true;

    // Simulate AI response
    setTimeout(() => {
      this.isTyping = false;
      const botResponse = this.generateBotResponse(userQuery);
      this.messages.push(botResponse);
    }, 1000 + Math.random() * 1000);
  }

  onQuickAction(action: QuickAction): void {
    this.userInput = action.query;
    this.sendMessage();
  }

  private generateBotResponse(query: string): ChatMessage {
    const lowerQuery = query.toLowerCase();

    // Check claim status
    if (lowerQuery.includes('claim') && (lowerQuery.includes('status') || lowerQuery.includes('check'))) {
      return {
        id: this.messageIdCounter++,
        content: 'Here are your recent claims:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'claim-card',
        data: this.sampleClaims
      };
    }

    // File new claim
    if (lowerQuery.includes('new claim') || lowerQuery.includes('file') || lowerQuery.includes('report')) {
      return {
        id: this.messageIdCounter++,
        content: 'I can help you file a new claim! Here\'s what you\'ll need:\n\n📋 **Required Information:**\n• Policy number\n• Date and time of incident\n• Description of what happened\n• Photos or documents (if available)\n\n🚗 **For Motor Claims:**\n• Vehicle registration\n• Other party details (if applicable)\n• Police report number (if applicable)\n\n🏠 **For Home Claims:**\n• Location of damage\n• Estimated value of loss\n\nClick the "New Claim" button in the sidebar or the floating "+" button to start the process.',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Show policies
    if (lowerQuery.includes('policy') || lowerQuery.includes('policies')) {
      const policyList = this.samplePolicies.map(p =>
        `📄 **${p.id}**\n   Type: ${p.type} | Status: ${p.status}\n   Expires: ${p.expires} | Premium: ${p.premium}`
      ).join('\n\n');

      return {
        id: this.messageIdCounter++,
        content: `Here are your active policies:\n\n${policyList}\n\nWould you like to file a claim against any of these policies?`,
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Dashboard stats
    if (lowerQuery.includes('dashboard') || lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      return {
        id: this.messageIdCounter++,
        content: `📊 **Your Claims Summary**\n\n` +
          `• Total Claims: **${this.dashboardStats.totalClaims}**\n` +
          `• Pending Review: **${this.dashboardStats.pendingClaims}**\n` +
          `• Approved: **${this.dashboardStats.approvedClaims}**\n` +
          `• Avg. Processing Time: **${this.dashboardStats.avgProcessingTime}**\n\n` +
          `Your claims are being processed efficiently. Is there anything specific you'd like to know?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'stats',
        data: this.dashboardStats
      };
    }

    // Help
    if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('need')) {
      return {
        id: this.messageIdCounter++,
        content: '🤖 **I can help you with:**\n\n' +
          '📋 **Claims**\n• Check claim status\n• File a new claim\n• Upload documents\n• Track claim progress\n\n' +
          '📄 **Policies**\n• View your policies\n• Check coverage details\n• Policy renewals\n\n' +
          '👥 **Support**\n• Contact your handler\n• Escalate an issue\n• FAQs\n\n' +
          'Just type your question or use the quick action buttons below!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Document upload
    if (lowerQuery.includes('document') || lowerQuery.includes('upload') || lowerQuery.includes('photo')) {
      return {
        id: this.messageIdCounter++,
        content: '📎 **Document Upload Guide**\n\n' +
          'To upload documents for your claim:\n\n' +
          '1. Go to **Claims** section\n' +
          '2. Click on your claim to open details\n' +
          '3. Navigate to the **Documents** tab\n' +
          '4. Click **Upload** and select your files\n\n' +
          '**Accepted formats:** PDF, JPG, PNG, DOC\n' +
          '**Max file size:** 10MB per file\n\n' +
          'Need help with a specific claim?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Handler/Contact
    if (lowerQuery.includes('handler') || lowerQuery.includes('contact') || lowerQuery.includes('speak')) {
      return {
        id: this.messageIdCounter++,
        content: '👥 **Your Assigned Handlers**\n\n' +
          '**Sarah Johnson** - Senior Claims Handler\n' +
          '📧 sarah.johnson@fnol.com\n' +
          '📞 +44 20 7123 4567\n\n' +
          '**Mike Chen** - Claims Specialist\n' +
          '📧 mike.chen@fnol.com\n' +
          '📞 +44 20 7123 4568\n\n' +
          'Office hours: Mon-Fri, 9:00 AM - 5:30 PM GMT',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Greeting
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return {
        id: this.messageIdCounter++,
        content: 'Hello! 👋 I\'m your AI Claims Assistant. I can help you with:\n\n' +
          '• Checking your claim status\n' +
          '• Filing a new claim\n' +
          '• Viewing your policies\n' +
          '• Uploading documents\n\n' +
          'What would you like to do today?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Thank you
    if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
      return {
        id: this.messageIdCounter++,
        content: 'You\'re welcome! 😊 Is there anything else I can help you with today?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Default response
    return {
      id: this.messageIdCounter++,
      content: `I understand you're asking about "${query}". Let me help you with that.\n\n` +
        'Here are some things I can assist with:\n' +
        '• **"Check my claims"** - View your claim status\n' +
        '• **"File a new claim"** - Start a new claim\n' +
        '• **"Show my policies"** - View your policies\n' +
        '• **"Help"** - Get general assistance\n\n' +
        'Please try one of these options or rephrase your question.',
      sender: 'bot',
      timestamp: new Date()
    };
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '&bull; ');
  }
}
