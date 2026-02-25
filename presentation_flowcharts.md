# Project Flowcharts & Architecture

Here are the high-level diagrams that explain the structure and flow of the `NeuralSpark` platform. You can use these in your college presentation.

## 1. Project Architecture & File Structure

This flowchart explains the core files and what their purpose is across the Next.js frontend and Django backend.

```mermaid
graph TD
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    Client((User Browser)) --> NextJS

    subgraph "Frontend (Next.js / React)"
        NextJS[Next.js App Router]:::frontend
        
        Pages[UI Pages]:::frontend
        Pages --> Home["page.tsx\nLanding Page"]
        Pages --> Learning["learning/page.tsx\nHub Dashboard"]
        Pages --> Video["learning/lectures/[id]/page.tsx\nVideo Player"]
        Pages --> Services["services/page.tsx\nBooking Form"]
        Pages --> QnA["question/[id]/page.tsx\nDiscussion Forum"]

        Components[Reusable UI]:::frontend
        Components --> Nav["Navbar.tsx\nGlobal Navigation"]

        NextJS --> Pages
        NextJS --> Components
        Pages -.-> APIClient[lib/api.ts\nAxios Client]
    end

    APIClient == "HTTP Requests" ==> DjangoAPI

    subgraph "Backend (Django / Python)"
        DjangoAPI[Django Ninja API]:::backend
        
        Config[e_learning_project/]:::backend
        Config --> Settings["settings.py\nEnvironment & Config"]
        Config --> URLS["urls.py\nEndpoint Routing"]

        API[api/]:::backend
        API --> Routes["routes.py\nAll Request Handlers"]
        API --> Schemas["schemas.py\nData Validation"]

        Core[core/]:::backend
        Core --> Models["models.py\nDatabase Schema"]
        Core --> AdminPanel["admin.py\nCMS Dashboard"]

        DjangoAPI --> Config
        DjangoAPI --> API
        API --> Core
    end

    Models -.-> DB[(SQLite Database)]:::database
```

## 2. Backend Data Flow & Functions

This flowchart breaks down the internal functions inside `routes.py`, `models.py`, and how they handle incoming HTTP requests (like creating a question or upvoting an answer).

```mermaid
flowchart TD
    classDef model fill:#f59e0b,color:#fff,stroke:#b45309;
    classDef route fill:#8b5cf6,color:#fff,stroke:#5b21b6;
    classDef schema fill:#ec4899,color:#fff,stroke:#be185d;

    Request((Frontend Request)) --> URLConf
    
    subgraph "URL Routing (urls.py)"
        URLConf[URL Matcher] --> AdminRoute[/admin/]
        URLConf --> APIRoute[/api/]
    end

    APIRoute --> SchemaVal
    
    subgraph "Data Validation (schemas.py)"
        SchemaVal["Pydantic Type Check"]:::schema
        SchemaVal --> |Valid| RouteHandlers
        SchemaVal -.-> |Invalid| Error422["422 Unprocessable Entity"]
    end

    subgraph "Logic & Controllers (routes.py)"
        RouteHandlers{Request Type}:::route
        
        %% QnA
        RouteHandlers --> |GET| list_questions[list_questions]
        RouteHandlers --> |POST| create_question[create_question]
        RouteHandlers --> |POST| create_answer[create_answer]
        RouteHandlers --> |POST| upvote_answer[upvote_answer]
        
        %% Core Features
        RouteHandlers --> |GET| list_lectures[list_lectures]
        RouteHandlers --> |POST| create_inquiry[create_inquiry]
        
        %% AI Integration
        RouteHandlers --> |POST| ai_grader_endpoint[ai_grader_endpoint]
        ai_grader_endpoint --> process_file[_process_uploaded_file]
        ai_grader_endpoint -.-> |Groq API| LLM((Vision LLM))
    end

    subgraph "Database Schema (models.py)"
        Models[(ORM System)]:::model
        
        list_questions -.-> Models
        create_question -.-> Models
        create_answer -.-> Models
        upvote_answer -.-> Models
        list_lectures -.-> Models
        create_inquiry -.-> Models
        
        Models --> User["User Model"]
        Models --> Question["Question Model"]
        Models --> Answer["Answer Model\nvotes"]
        Models --> Lecture["Lecture Model\nvideo_url"]
        Models --> Inquiry["Inquiry Model\nbooking data"]
    end
```
