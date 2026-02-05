<script lang="ts">
  console.log("Main page loaded!");
</script>

<h1>Dev Docs</h1>

<pre class="mermaid">
graph TB
    subgraph Init ["🎬 Инициализация (1 раз)"]
        Page[+page.svelte<br />onMount]
        Canvas[Canvas Element<br />getContext 2d]
        SetCtx[setContext<br />ball, paddle, input, ctx]
    end
    
    subgraph ContextAPI ["📦 Context API - Svelte DI"]
        Ctx[(GAME_KEY<br />ball, paddle, input, ctx<br />width, height)]
    end
    
    subgraph Setup ["⚙️ Setup Phase (1 раз)"]
        Game[Game.svelte<br />onMount]
        Keyboard[setupKeyboard]
        Touch[setupTouch]
    end
    
    subgraph Loop ["♾️ Animation Loop (60 FPS)"]
        GameLoop[GameLoop.svelte<br />requestAnimationFrame]
        Clear[ctx.clearRect]
        Update[updatePaddle<br />updateBall]
        Render[renderPaddle<br />renderBall]
        RAF[requestAnimationFrame]
    end
    
    subgraph Logic ["🎯 Entities Module"]
        UpdateFn[Мутация по ссылке:<br />ball.x += ball.dx<br />paddle.x = newX]
        RenderFn[Рисование на canvas:<br />drawCircle ctx, ball.x, ball.y<br
  />drawRect ctx, paddle.x, paddleY]
    end
    
    %% Initialization Flow
    Page --> Canvas
    Canvas --> SetCtx
    SetCtx -->|создает| Ctx
    
    %% Setup Flow  
    Page --> Game
    Game -.->|getContext| Ctx
    Game --> Keyboard
    Game --> Touch
    Keyboard -.->|мутирует input| Ctx
    Touch -.->|мутирует paddle| Ctx
    
    %% Loop Flow
    Game --> GameLoop
    GameLoop -.->|getContext<br />получает ссылки| Ctx
    GameLoop --> Clear
    Clear --> Update
    Update --> Render
    Render --> RAF
    RAF -.->|loop| Clear
    
    %% Entity Logic
    Update --> UpdateFn
    UpdateFn -.->|мутирует ball/paddle| Ctx
    Render --> RenderFn
    RenderFn -.->|читает ctx| Ctx
    
    %% Styling
    linkStyle 2,7,11,15,17 stroke:#ff4444,stroke-width:4px
    linkStyle 5,6,8,9,14,16 stroke:#4444ff,stroke-width:2px,stroke-dasharray:5
    
    classDef init fill:#FFE4B5,stroke:#FF8C00,stroke-width:2px
    classDef context fill:#87CEEB,stroke:#4169E1,stroke-width:3px
    classDef setup fill:#FFD700,stroke:#DAA520,stroke-width:2px
    classDef loop fill:#90EE90,stroke:#228B22,stroke-width:2px
    classDef logic fill:#DDA0DD,stroke:#8B008B,stroke-width:2px
    
    class Page,Canvas,SetCtx init
    class Ctx context
    class Game,Keyboard,Touch setup
    class GameLoop,Clear,Update,Render,RAF loop
    class UpdateFn,RenderFn logic
</pre>

<pre class="mermaid">graph TB
    Page[+page.svelte] -->|setGameState<br
  />ctx, ball, paddle| Context[🗄️ Context<br />Game State]
    
    Page --> Game[Game.svelte]
    Game --> Input[⌨️ Input<br />setupKeyboard/Touch]
    Input -.->|mutates input| Context
    
    Game --> Loop[GameLoop.svelte]
    Loop -.->|getGameState<br />ctx, ball, paddle, input| Context
    
    Loop -->|updateBall<br />updatePaddle| Entities[Entities Module]
    Entities -.->|mutates<br />ball.x, paddle.x| Context
    
    Loop -->|renderBall<br />renderPaddle| Canvas[🎨 Canvas Context]
    Canvas -.->|reads ctx| Context
    
    %% Красные — инициализация, синие — чтение, зеленые — мутация
    linkStyle 0 stroke:#ff4444,stroke-width:4px
    linkStyle 1,2,3 stroke:#4444ff,stroke-width:2px
    linkStyle 4,5 stroke:#44ff44,stroke-width:3px
    
    classDef component fill:#FFD700
    classDef context fill:#87CEEB
    classDef module fill:#DDA0DD
    
    class Page,Game,Loop component
    class Context context
    class Input,Entities module</pre>

<pre class="mermaid">
graph TB
    Page[+page.svelte] -->|1. setGameState<br
  />ctx, ball, paddle, input| Context[🗄️ Context<br />Game State Store]
    
    Page --> Game[Game.svelte<br />Input Setup]
    Game -->|2. setupKeyboard<br />setupTouch| Input[⌨️ Input Handlers]
    Input -.->|обновляет| Context
    
    Game --> Loop[GameLoop.svelte<br />Animation Loop]
    Loop -.->|3. getGameState| Context
    
    Loop -->|4. update & render| Entities[🎯 Entities<br />updateBall<br
  />updatePaddle<br />renderBall<br />renderPaddle]
    Entities -.->|мутирует| Context
    
    subgraph "🎮 Svelte Components"
        Page
        Game  
        Loop
    end
    
    subgraph "📊 Core Modules"
        Context
        Input
        Entities
    end
    
    %% Красные жирные стрелки для основного потока
    linkStyle 0,1,2,3,4 stroke:#ff4444,stroke-width:4px
    
    classDef component fill:#FFD700,stroke:#DAA520,stroke-width:3px,color:#000
    classDef module fill:#87CEEB,stroke:#4169E1,stroke-width:3px,color:#000
    
    class Page,Game,Loop component
    class Context,Input,Entities module
</pre>

<pre class="mermaid">
graph LR
    subgraph Page ["📄 +page.svelte (Entry Point)"]
        P[+page.svelte]
    end
    
    subgraph Game ["🎮 Game.svelte"]
        G[Game.svelte]
    end
    
    subgraph Loop ["⚡ GameLoop.svelte"]
        L[GameLoop.svelte]
    end
    
    subgraph Context ["📊 Context (Shared State)"]
        CTX[ctx, width, height<br />ball, paddle, input]
    end
    
    subgraph InputHandlers ["⌨️ Input Handlers"]
        KBD[setupKeyboard]
        TOUCH[setupTouch]
    end
    
    subgraph Entities ["🔧 Update/Render Functions"]
        UPD[Paddle/Ball Update]
        REND[Paddle/Ball Render]
    end
    
    %% Связи
    P -->|"canvas → ctx<br />setGameState(init)"| CTX
    P -.->|"if isReady"| G
    
    G -->|"getGameState()"| CTX
    G -->|"onMount"| KBD
    G -->|"onMount"| TOUCH
    KBD -.->|"input.left/right"| CTX
    TOUCH -.->|"paddle.x"| CTX
    
    G -.->|"рендерит"| L
    
    L -->|"getGameState()"| CTX
    L -->|"onMount → RAF loop"| CTX
    CTX -->|"clearRect"| CTX
    CTX -.->|"updatePaddle/Ball"| UPD
    CTX -.->|"renderPaddle/Ball"| REND
    UPD -.->|"ball/paddle"| CTX
    REND -.->|"ctx"| CTX
    
    %% Стилизация: ключевые потоки жирные красные
    linkStyle 0,1,2,3,7,10,12 stroke:#ff0000,stroke-width:3px
    
    classDef page fill:#FFD700,stroke:#333,stroke-width:2px,color:#000
    classDef game fill:#FFA500,stroke:#333,stroke-width:2px,color:#000
    classDef loop fill:#90EE90,stroke:#333,stroke-width:2px,color:#000
    classDef ctx fill:#87CEEB,stroke:#333,stroke-width:2px,color:#000
    classDef input fill:#FF9999,stroke:#333,stroke-width:2px,color:#000
    classDef entities fill:#D3D3D3,stroke:#333,stroke-width:2px,color:#000
    
    class P page
    class G game
    class L loop
    class CTX ctx
    class KBD,TOUCH input
    class UPD,REND entities
</pre>
