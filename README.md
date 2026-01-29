# Automation Flow Builder - Frontend

Modern Next.js frontend for building visual email automation workflows with an intuitive drag-and-drop interface.

## 🚀 Features

- **Visual Flow Editor** powered by React Flow
- **Drag-and-drop** node creation and arrangement
- **Custom Node Types:**
  - Start & End nodes
  - Action nodes (Email sending)
  - Delay nodes (Relative & specific datetime)
  - Condition nodes (Email-based branching)
- **Real-time editing** with inline node configuration
- **Automation Management** - Create, edit, delete, test automations
- **Test Run Dialog** - Execute flows with email input
- **Responsive UI** with Tailwind CSS
- **TypeScript** for type safety

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **React Flow** - Visual flow editor
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Netlify** - Deployment platform

## 📁 Project Structure

```
automation-flow-builder-frontend/
├── app/
│   ├── editor/
│   │   └── [id]/
│   │       └── page.tsx         # Flow editor page
│   ├── page.tsx                  # Home (automation list)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── nodes/
│   │   ├── StartNode.tsx
│   │   ├── EndNode.tsx
│   │   ├── ActionNode.tsx
│   │   ├── DelayNode.tsx
│   │   └── ConditionNode.tsx
│   ├── TestRunDialog.tsx
│   ├── SaveDialog.tsx
│   └── Toolbar.tsx
├── lib/
│   ├── api.ts                    # Axios instance
│   └── automationService.ts      # API service functions
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdhasanshuvo/automation-flow-builder-frontend.git
   cd automation-flow-builder-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

   Update with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎨 User Interface

### Home Page (Automation List)

- **View all automations** in a clean table
- **Create** new automation
- **Edit** existing automation
- **Delete** automation with confirmation
- **Test** automation with email input

### Flow Editor

- **Visual canvas** with Start and End nodes
- **Toolbar** to add nodes:
  - Action (Email)
  - Delay
  - Condition
- **Drag nodes** to reposition
- **Click to edit** node settings
- **Connect nodes** by dragging from handles
- **Save/Update** with unique name validation

### Node Configuration

#### Action Node (Email)
- **Message** text area
- Validates non-empty message
- Preview on node card

#### Delay Node
Two modes:
- **Relative Delay:**
  - Value (number)
  - Unit (minutes, hours, days)
- **Specific Date & Time:**
  - Date/time picker
  - Validates future dates

#### Condition Node (Bonus)
- **Rules Builder:**
  - Field: Email
  - Operators: equals, not equals, includes, starts with, ends with
  - Multiple rules with AND/OR logic
- **Branching:**
  - TRUE path (green)
  - FALSE path (red)

## 📱 Features Walkthrough

### Creating an Automation

1. Click **"Create Automation"**
2. Flow editor opens with Start → End
3. Add nodes from toolbar
4. Configure each node
5. Connect nodes
6. Click **"Save"**
7. Enter unique name
8. Redirects to home

### Editing an Automation

1. Click **"Edit"** on automation
2. Flow editor loads existing flow
3. Modify nodes/connections
4. Click **"Update"**
5. Confirm name or change it

### Testing an Automation

1. Click **"Test"** on automation
2. Enter recipient email
3. Click **"Start Test Run"**
4. Automation executes in backend
5. Emails sent to recipient
6. Delays processed asynchronously

### Deleting an Automation

1. Click **"Delete"** on automation
2. Confirm deletion
3. Automation removed from database

## 🎯 Node Types Explained

### Start Node (Green)
- Flow entry point
- Cannot be deleted
- One per flow
- Source handle only

### End Node (Red)
- Flow termination
- Cannot be deleted
- One per flow
- Target handle only

### Action Node (Blue)
- Sends email during execution
- Configure message content
- Editable and deletable
- Both target and source handles

### Delay Node (Yellow)
- Pauses execution
- Relative or specific datetime
- Editable and deletable
- Both target and source handles

### Condition Node (Purple)
- Evaluates email rules
- Branches flow (TRUE/FALSE)
- Multiple rules with AND/OR
- Two source handles (TRUE, FALSE)

## 🚀 Deployment

### Deploy to Netlify

1. **Push code to GitHub**
   ```bash
   git remote add origin https://github.com/mdhasanshuvo/automation-flow-builder-frontend.git
   git push -u origin main
   ```

2. **Import to Netlify**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   
3. **Environment Variables**
   Add to Netlify:
   ```
   NEXT_PUBLIC_API_URL=https://automation-flow-builder-backend.vercel.app/api
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Production URL
```
https://automation-flow-builder.netlify.app
```

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom colors** for node types:
  - Green: Start
  - Red: End
  - Blue: Action
  - Yellow: Delay
  - Purple: Condition
- **Responsive design** - works on desktop and tablet
- **Modal dialogs** for editing and testing

## 🔌 API Integration

All API calls handled through `lib/automationService.ts`:

```typescript
// Get all automations
const automations = await getAllAutomations();

// Create automation
await createAutomation({ name, flowData });

// Update automation
await updateAutomation(id, { name, flowData });

// Delete automation
await deleteAutomation(id);

// Test run
await testRunAutomation(id, email);
```

## 📝 Development Notes

### Node Update Mechanism

Nodes communicate with the editor through custom DOM events:
- `updateNode` - Updates node data
- `deleteNode` - Deletes a node

This pattern allows nodes to update their parent without prop drilling.

### Flow Validation

- Start and End nodes cannot be deleted
- Node names must be unique
- Automation names must be unique (validated by backend)
- Email validation before test run

## 🧪 Testing Locally

1. Start backend server (port 5000)
2. Start frontend (port 3000)
3. Create an automation
4. Test with your email
5. Check inbox for emails

## 📄 Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔒 Security

- Environment variables for API URL
- Client-side validation
- CORS handled by backend
- No sensitive data stored in frontend

## 🎓 Interview Talking Points

1. **Architecture**: Clean component structure, separation of concerns
2. **State Management**: React hooks (useState, useEffect, useCallback)
3. **Type Safety**: TypeScript for better developer experience
4. **Custom Hooks**: React Flow state management
5. **Event System**: Custom DOM events for node communication
6. **Validation**: Client and server-side validation
7. **UX**: Intuitive drag-and-drop, inline editing
8. **Deployment**: Modern CI/CD with Netlify

## 🤝 Contributing

This is a portfolio/interview project. Contributions welcome for educational purposes.

## 📧 Contact

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ as a production-quality portfolio project**
