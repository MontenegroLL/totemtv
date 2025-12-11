# APPX - Plano de Engenharia de Software Completo
## Sistema de Exibição de Anúncios para Android TV via Google Drive

---

## 📋 PARTE 1: ELICITAÇÃO DE REQUISITOS

### 1.1 Requisitos Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | Conectar-se a uma pasta compartilhada do Google Drive via URL | Alta |
| RF02 | Listar e baixar arquivos de imagem (JPG, PNG, WEBP, GIF) | Alta |
| RF03 | Listar e baixar arquivos de vídeo (MP4, MKV, AVI, WEBM) | Alta |
| RF04 | Exibir imagens por tempo configurável (temporizador) | Alta |
| RF05 | Reproduzir vídeos até o final automaticamente | Alta |
| RF06 | Reprodução sequencial automática (playlist) | Alta |
| RF07 | Loop infinito da playlist | Média |
| RF08 | Autenticação de administrador para configurações | Média |
| RF09 | Tela de configuração para URL do Drive e tempo de imagem | Alta |
| RF10 | Cache local de arquivos para reprodução offline | Média |
| RF11 | Sincronização automática com Google Drive (intervalo configurável) | Alta |
| RF12 | Logs de reprodução e erros | Baixa |

### 1.2 Requisitos Não-Funcionais

| ID | Requisito | Especificação |
|----|-----------|---------------|
| RNF01 | Compatibilidade | Android TV API 21+ (Lollipop) |
| RNF02 | Performance | Transição entre mídias < 500ms |
| RNF03 | Disponibilidade | 99.9% uptime em modo offline |
| RNF04 | Segurança | Criptografia de credenciais locais |
| RNF05 | Usabilidade | Navegação por controle remoto (D-pad) |
| RNF06 | Escalabilidade | Suporte a até 1000 arquivos na playlist |

### 1.3 Casos de Uso

```
┌─────────────────────────────────────────────────────────────┐
│                      APPX - Casos de Uso                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐                                               │
│  │Administra│──▶ UC01: Configurar URL do Google Drive       │
│  │   dor    │──▶ UC02: Definir tempo de exibição de imagem  │
│  └──────────┘──▶ UC03: Iniciar/Parar reprodução             │
│       │      ──▶ UC04: Forçar sincronização                 │
│       │      ──▶ UC05: Visualizar logs                      │
│       │                                                     │
│       ▼                                                     │
│  ┌──────────┐                                               │
│  │ Sistema  │──▶ UC06: Baixar arquivos do Drive             │
│  │  APPX    │──▶ UC07: Reproduzir mídia sequencialmente     │
│  └──────────┘──▶ UC08: Sincronizar automaticamente          │
│                 ──▶ UC09: Gerenciar cache local             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📐 PARTE 2: ARQUITETURA DO SISTEMA

### 2.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            APPX ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      PRESENTATION LAYER                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │  Splash     │  │  Settings   │  │     Media Player        │  │   │
│  │  │  Activity   │  │  Activity   │  │     Activity            │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      APPLICATION LAYER                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │  Playlist   │  │   Sync      │  │     Timer               │  │   │
│  │  │  Manager    │  │   Service   │  │     Controller          │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        DATA LAYER                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │  Google     │  │   Local     │  │     Shared              │  │   │
│  │  │  Drive API  │  │   SQLite    │  │     Preferences         │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     EXTERNAL SERVICES                            │   │
│  │              ┌──────────────────────────────┐                    │   │
│  │              │     Google Drive Cloud       │                    │   │
│  │              │   (Pasta Compartilhada)      │                    │   │
│  │              └──────────────────────────────┘                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Stack Tecnológica

```yaml
Frontend (Android TV):
  linguagem: Kotlin
  sdk_minimo: API 21 (Android 5.0)
  sdk_target: API 34 (Android 14)
  arquitetura: MVVM + Clean Architecture
  ui_framework: Leanback Library (Android TV)
  player_video: ExoPlayer
  player_imagem: Glide/Coil
  navegacao: Navigation Component

Backend (Opcional - para analytics):
  runtime: Node.js 20 LTS
  framework: Express.js ou Fastify
  linguagem: TypeScript
  
Banco de Dados:
  local: SQLite + Room ORM
  remoto: Google Drive API v3
  cache: SharedPreferences
  
Autenticação:
  metodo: Google OAuth 2.0
  escopo: drive.readonly
  
DevOps:
  ci_cd: GitHub Actions
  distribuicao: Firebase App Distribution
  monitoramento: Firebase Crashlytics
  analytics: Firebase Analytics
```

---

## 🗄️ PARTE 3: MODELAGEM DE BANCO DE DADOS

### 3.1 Schema SQLite Local

```sql
-- Tabela de configurações do app
CREATE TABLE app_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    drive_folder_url TEXT NOT NULL,
    image_display_time_seconds INTEGER DEFAULT 10,
    sync_interval_minutes INTEGER DEFAULT 30,
    last_sync_timestamp INTEGER,
    is_playing BOOLEAN DEFAULT FALSE,
    loop_enabled BOOLEAN DEFAULT TRUE,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Tabela de arquivos de mídia
CREATE TABLE media_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drive_file_id TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK(file_type IN ('IMAGE', 'VIDEO')),
    mime_type TEXT NOT NULL,
    file_size_bytes INTEGER,
    local_path TEXT,
    download_status TEXT DEFAULT 'PENDING' CHECK(download_status IN ('PENDING', 'DOWNLOADING', 'COMPLETED', 'ERROR')),
    display_order INTEGER,
    duration_seconds INTEGER, -- Para vídeos
    last_played_at INTEGER,
    play_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Tabela de logs de reprodução
CREATE TABLE playback_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_file_id INTEGER,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    FOREIGN KEY (media_file_id) REFERENCES media_files(id) ON DELETE CASCADE
);

-- Tabela de credenciais (criptografadas)
CREATE TABLE credentials (
    id INTEGER PRIMARY KEY DEFAULT 1,
    encrypted_access_token TEXT,
    encrypted_refresh_token TEXT,
    token_expiry INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Índices para performance
CREATE INDEX idx_media_files_order ON media_files(display_order);
CREATE INDEX idx_media_files_status ON media_files(download_status);
CREATE INDEX idx_playback_logs_date ON playback_logs(started_at);
```

### 3.2 Diagrama ER

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   app_config    │       │   media_files   │       │ playback_logs   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │◄──────│ id (PK)         │
│ drive_folder_url│       │ drive_file_id   │       │ media_file_id   │
│ image_display   │       │ file_name       │       │ started_at      │
│ sync_interval   │       │ file_type       │       │ ended_at        │
│ last_sync       │       │ mime_type       │       │ completed       │
│ is_playing      │       │ local_path      │       │ error_message   │
│ loop_enabled    │       │ download_status │       └─────────────────┘
└─────────────────┘       │ display_order   │
                          │ duration_seconds│
                          │ play_count      │
                          └─────────────────┘
                                  │
                                  │
                          ┌───────▼───────┐
                          │  credentials  │
                          ├───────────────┤
                          │ id (PK)       │
                          │ access_token  │
                          │ refresh_token │
                          │ token_expiry  │
                          └───────────────┘
```

---

## 🎨 PARTE 4: DESIGN DE INTERFACE (Android TV)

### 4.1 Wireframes das Telas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TELA 1: SPLASH SCREEN                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                                                                         │
│                           ┌─────────────┐                               │
│                           │             │                               │
│                           │    APPX     │                               │
│                           │    LOGO     │                               │
│                           │             │                               │
│                           └─────────────┘                               │
│                                                                         │
│                        [ Carregando... ○○○ ]                            │
│                                                                         │
│                         Versão 1.0.0                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      TELA 2: CONFIGURAÇÕES                              │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⚙️  CONFIGURAÇÕES DO APPX                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📁 URL da Pasta Google Drive                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ https://drive.google.com/drive/folders/xxxxx             │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⏱️  Tempo de Exibição de Imagens                               │   │
│  │  ┌────┐                                                         │   │
│  │  │ 10 │ segundos        [ - ]  ═══════●═══  [ + ]              │   │
│  │  └────┘                                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔄 Intervalo de Sincronização                                  │   │
│  │  ┌────┐                                                         │   │
│  │  │ 30 │ minutos         [ - ]  ═══●═══════  [ + ]              │   │
│  │  └────┘                                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│       [ 🔐 AUTENTICAR ]     [ 💾 SALVAR ]     [ ▶️ INICIAR ]           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      TELA 3: PLAYER DE MÍDIA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │                                                                 │   │
│  │                                                                 │   │
│  │                    [ CONTEÚDO DE MÍDIA ]                        │   │
│  │                    (Imagem ou Vídeo)                            │   │
│  │                      FULLSCREEN                                 │   │
│  │                                                                 │   │
│  │                                                                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ══════════════════════════●══════════════════════════════════  │   │
│  │  00:15 / 00:30                                     📁 03/15    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      TELA 4: MENU OVERLAY (Pressionar OK)               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│         ┌───────────────────────────────────────────────┐               │
│         │               MENU APPX                       │               │
│         ├───────────────────────────────────────────────┤               │
│         │                                               │               │
│         │   [ ▶️ Reproduzir / ⏸️ Pausar ]               │               │
│         │                                               │               │
│         │   [ ⏭️ Próximo ]                              │               │
│         │                                               │               │
│         │   [ ⏮️ Anterior ]                             │               │
│         │                                               │               │
│         │   [ 🔄 Sincronizar Agora ]                    │               │
│         │                                               │               │
│         │   [ ⚙️ Configurações ]                        │               │
│         │                                               │               │
│         │   [ ❌ Sair ]                                 │               │
│         │                                               │               │
│         └───────────────────────────────────────────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Design System

```yaml
cores:
  primary: "#1E88E5"      # Azul principal
  primary_dark: "#1565C0"  # Azul escuro
  secondary: "#FFC107"     # Amarelo destaque
  background: "#121212"    # Fundo escuro (TV)
  surface: "#1E1E1E"       # Cards e superfícies
  text_primary: "#FFFFFF"  # Texto principal
  text_secondary: "#B3B3B3" # Texto secundário
  success: "#4CAF50"       # Verde sucesso
  error: "#F44336"         # Vermelho erro
  
tipografia:
  font_family: "Roboto"
  heading_large: 48sp
  heading_medium: 32sp
  body_large: 24sp
  body_medium: 18sp
  caption: 14sp

espacamento:
  margin_screen: 48dp
  margin_card: 24dp
  padding_button: 16dp
  radius_card: 8dp
  radius_button: 4dp

focus_states:
  border_width: 4dp
  border_color: "#FFC107"
  scale_factor: 1.05
```

---

## 💻 PARTE 5: ESTRUTURA DE CÓDIGO

### 5.1 Estrutura de Diretórios

```
appx/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/appx/
│   │   │   │   ├── AppXApplication.kt
│   │   │   │   │
│   │   │   │   ├── di/                          # Dependency Injection
│   │   │   │   │   ├── AppModule.kt
│   │   │   │   │   ├── DatabaseModule.kt
│   │   │   │   │   ├── NetworkModule.kt
│   │   │   │   │   └── RepositoryModule.kt
│   │   │   │   │
│   │   │   │   ├── data/                        # Data Layer
│   │   │   │   │   ├── local/
│   │   │   │   │   │   ├── database/
│   │   │   │   │   │   │   ├── AppDatabase.kt
│   │   │   │   │   │   │   ├── dao/
│   │   │   │   │   │   │   │   ├── MediaFileDao.kt
│   │   │   │   │   │   │   │   ├── ConfigDao.kt
│   │   │   │   │   │   │   │   └── PlaybackLogDao.kt
│   │   │   │   │   │   │   └── entity/
│   │   │   │   │   │   │       ├── MediaFileEntity.kt
│   │   │   │   │   │   │       ├── ConfigEntity.kt
│   │   │   │   │   │   │       └── PlaybackLogEntity.kt
│   │   │   │   │   │   └── preferences/
│   │   │   │   │   │       └── AppPreferences.kt
│   │   │   │   │   │
│   │   │   │   │   ├── remote/
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── GoogleDriveApi.kt
│   │   │   │   │   │   └── dto/
│   │   │   │   │   │       ├── DriveFileDto.kt
│   │   │   │   │   │       └── DriveListResponseDto.kt
│   │   │   │   │   │
│   │   │   │   │   └── repository/
│   │   │   │   │       ├── MediaRepository.kt
│   │   │   │   │       ├── MediaRepositoryImpl.kt
│   │   │   │   │       ├── ConfigRepository.kt
│   │   │   │   │       └── ConfigRepositoryImpl.kt
│   │   │   │   │
│   │   │   │   ├── domain/                      # Domain Layer
│   │   │   │   │   ├── model/
│   │   │   │   │   │   ├── MediaFile.kt
│   │   │   │   │   │   ├── AppConfig.kt
│   │   │   │   │   │   ├── PlaybackState.kt
│   │   │   │   │   │   └── SyncStatus.kt
│   │   │   │   │   │
│   │   │   │   │   └── usecase/
│   │   │   │   │       ├── SyncMediaFilesUseCase.kt
│   │   │   │   │       ├── GetPlaylistUseCase.kt
│   │   │   │   │       ├── DownloadMediaUseCase.kt
│   │   │   │   │       ├── SaveConfigUseCase.kt
│   │   │   │   │       └── AuthenticateUseCase.kt
│   │   │   │   │
│   │   │   │   ├── presentation/                # Presentation Layer
│   │   │   │   │   ├── splash/
│   │   │   │   │   │   ├── SplashActivity.kt
│   │   │   │   │   │   └── SplashViewModel.kt
│   │   │   │   │   │
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   ├── SettingsActivity.kt
│   │   │   │   │   │   ├── SettingsViewModel.kt
│   │   │   │   │   │   └── SettingsFragment.kt
│   │   │   │   │   │
│   │   │   │   │   ├── player/
│   │   │   │   │   │   ├── PlayerActivity.kt
│   │   │   │   │   │   ├── PlayerViewModel.kt
│   │   │   │   │   │   ├── ImagePlayerFragment.kt
│   │   │   │   │   │   ├── VideoPlayerFragment.kt
│   │   │   │   │   │   └── MenuOverlayFragment.kt
│   │   │   │   │   │
│   │   │   │   │   └── common/
│   │   │   │   │       ├── BaseActivity.kt
│   │   │   │   │       ├── BaseViewModel.kt
│   │   │   │   │       └── ViewState.kt
│   │   │   │   │
│   │   │   │   ├── service/                     # Background Services
│   │   │   │   │   ├── SyncService.kt
│   │   │   │   │   ├── DownloadService.kt
│   │   │   │   │   └── PlaybackService.kt
│   │   │   │   │
│   │   │   │   └── util/                        # Utilities
│   │   │   │       ├── Constants.kt
│   │   │   │       ├── Extensions.kt
│   │   │   │       ├── FileUtils.kt
│   │   │   │       ├── EncryptionUtils.kt
│   │   │   │       └── NetworkUtils.kt
│   │   │   │
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── activity_splash.xml
│   │   │   │   │   ├── activity_settings.xml
│   │   │   │   │   ├── activity_player.xml
│   │   │   │   │   ├── fragment_settings.xml
│   │   │   │   │   ├── fragment_image_player.xml
│   │   │   │   │   ├── fragment_video_player.xml
│   │   │   │   │   └── fragment_menu_overlay.xml
│   │   │   │   │
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   ├── styles.xml
│   │   │   │   │   └── dimens.xml
│   │   │   │   │
│   │   │   │   ├── drawable/
│   │   │   │   │   ├── ic_launcher.xml
│   │   │   │   │   ├── bg_button.xml
│   │   │   │   │   ├── bg_card.xml
│   │   │   │   │   └── selector_focus.xml
│   │   │   │   │
│   │   │   │   └── xml/
│   │   │   │       └── network_security_config.xml
│   │   │   │
│   │   │   └── AndroidManifest.xml
│   │   │
│   │   └── test/
│   │       └── java/com/appx/
│   │           ├── data/
│   │           │   └── repository/
│   │           │       └── MediaRepositoryTest.kt
│   │           ├── domain/
│   │           │   └── usecase/
│   │           │       └── SyncMediaFilesUseCaseTest.kt
│   │           └── presentation/
│   │               └── player/
│   │                   └── PlayerViewModelTest.kt
│   │
│   ├── build.gradle.kts
│   └── proguard-rules.pro
│
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
└── README.md
```

### 5.2 Código Principal (Kotlin + TypeScript Types)

#### 5.2.1 Models (Domain Layer)

```kotlin
// domain/model/MediaFile.kt
package com.appx.domain.model

import java.io.Serializable

enum class MediaType {
    IMAGE, VIDEO
}

enum class DownloadStatus {
    PENDING, DOWNLOADING, COMPLETED, ERROR
}

data class MediaFile(
    val id: Long = 0,
    val driveFileId: String,
    val fileName: String,
    val mediaType: MediaType,
    val mimeType: String,
    val fileSizeBytes: Long? = null,
    val localPath: String? = null,
    val downloadStatus: DownloadStatus = DownloadStatus.PENDING,
    val displayOrder: Int = 0,
    val durationSeconds: Int? = null,
    val playCount: Int = 0
) : Serializable {
    
    val isImage: Boolean get() = mediaType == MediaType.IMAGE
    val isVideo: Boolean get() = mediaType == MediaType.VIDEO
    val isDownloaded: Boolean get() = downloadStatus == DownloadStatus.COMPLETED
    
    companion object {
        val SUPPORTED_IMAGE_EXTENSIONS = listOf("jpg", "jpeg", "png", "webp", "gif", "bmp")
        val SUPPORTED_VIDEO_EXTENSIONS = listOf("mp4", "mkv", "avi", "webm", "mov", "m4v")
        
        fun fromExtension(extension: String): MediaType? {
            return when (extension.lowercase()) {
                in SUPPORTED_IMAGE_EXTENSIONS -> MediaType.IMAGE
                in SUPPORTED_VIDEO_EXTENSIONS -> MediaType.VIDEO
                else -> null
            }
        }
    }
}
```

```kotlin
// domain/model/AppConfig.kt
package com.appx.domain.model

data class AppConfig(
    val driveFolderUrl: String = "",
    val imageDisplayTimeSeconds: Int = 10,
    val syncIntervalMinutes: Int = 30,
    val lastSyncTimestamp: Long? = null,
    val isPlaying: Boolean = false,
    val loopEnabled: Boolean = true
) {
    val isConfigured: Boolean 
        get() = driveFolderUrl.isNotBlank()
    
    val folderId: String?
        get() = extractFolderId(driveFolderUrl)
    
    companion object {
        private val FOLDER_ID_REGEX = Regex(
            """(?:folders/|id=)([a-zA-Z0-9_-]+)"""
        )
        
        fun extractFolderId(url: String): String? {
            return FOLDER_ID_REGEX.find(url)?.groupValues?.getOrNull(1)
        }
    }
}
```

```kotlin
// domain/model/PlaybackState.kt
package com.appx.domain.model

sealed class PlaybackState {
    object Idle : PlaybackState()
    object Loading : PlaybackState()
    data class PlayingImage(
        val mediaFile: MediaFile,
        val remainingSeconds: Int,
        val currentIndex: Int,
        val totalItems: Int
    ) : PlaybackState()
    data class PlayingVideo(
        val mediaFile: MediaFile,
        val currentPosition: Long,
        val duration: Long,
        val currentIndex: Int,
        val totalItems: Int
    ) : PlaybackState()
    object Paused : PlaybackState()
    data class Error(val message: String) : PlaybackState()
    object Completed : PlaybackState()
}
```

#### 5.2.2 Use Cases (Domain Layer)

```kotlin
// domain/usecase/SyncMediaFilesUseCase.kt
package com.appx.domain.usecase

import com.appx.data.repository.MediaRepository
import com.appx.data.repository.ConfigRepository
import com.appx.domain.model.MediaFile
import com.appx.domain.model.SyncStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class SyncMediaFilesUseCase @Inject constructor(
    private val mediaRepository: MediaRepository,
    private val configRepository: ConfigRepository
) {
    operator fun invoke(): Flow<SyncStatus> = flow {
        emit(SyncStatus.Syncing)
        
        try {
            val config = configRepository.getConfig()
            val folderId = config.folderId
                ?: throw IllegalStateException("Folder ID not configured")
            
            // Buscar arquivos do Google Drive
            val remoteFiles = mediaRepository.fetchRemoteFiles(folderId)
            
            // Obter arquivos locais
            val localFiles = mediaRepository.getLocalFiles()
            
            // Identificar arquivos novos
            val newFiles = remoteFiles.filter { remote ->
                localFiles.none { it.driveFileId == remote.driveFileId }
            }
            
            // Identificar arquivos removidos
            val removedFileIds = localFiles
                .filter { local -> remoteFiles.none { it.driveFileId == local.driveFileId } }
                .map { it.id }
            
            // Salvar novos arquivos no banco
            mediaRepository.insertFiles(newFiles)
            
            // Remover arquivos deletados
            mediaRepository.deleteFiles(removedFileIds)
            
            // Atualizar timestamp de sincronização
            configRepository.updateLastSync(System.currentTimeMillis())
            
            emit(SyncStatus.Success(
                newFilesCount = newFiles.size,
                removedFilesCount = removedFileIds.size,
                totalFiles = remoteFiles.size
            ))
            
        } catch (e: Exception) {
            emit(SyncStatus.Error(e.message ?: "Unknown error"))
        }
    }
}
```

```kotlin
// domain/usecase/GetPlaylistUseCase.kt
package com.appx.domain.usecase

import com.appx.data.repository.MediaRepository
import com.appx.domain.model.MediaFile
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetPlaylistUseCase @Inject constructor(
    private val mediaRepository: MediaRepository
) {
    operator fun invoke(): Flow<List<MediaFile>> {
        return mediaRepository.getDownloadedFilesFlow()
    }
    
    suspend fun getNextFile(currentIndex: Int, loopEnabled: Boolean): MediaFile? {
        val files = mediaRepository.getDownloadedFiles()
        if (files.isEmpty()) return null
        
        val nextIndex = currentIndex + 1
        return when {
            nextIndex < files.size -> files[nextIndex]
            loopEnabled -> files.firstOrNull()
            else -> null
        }
    }
    
    suspend fun getPreviousFile(currentIndex: Int, loopEnabled: Boolean): MediaFile? {
        val files = mediaRepository.getDownloadedFiles()
        if (files.isEmpty()) return null
        
        val prevIndex = currentIndex - 1
        return when {
            prevIndex >= 0 -> files[prevIndex]
            loopEnabled -> files.lastOrNull()
            else -> null
        }
    }
}
```

#### 5.2.3 Repository (Data Layer)

```kotlin
// data/repository/MediaRepository.kt
package com.appx.data.repository

import com.appx.domain.model.MediaFile
import kotlinx.coroutines.flow.Flow

interface MediaRepository {
    suspend fun fetchRemoteFiles(folderId: String): List<MediaFile>
    suspend fun getLocalFiles(): List<MediaFile>
    suspend fun getDownloadedFiles(): List<MediaFile>
    fun getDownloadedFilesFlow(): Flow<List<MediaFile>>
    suspend fun insertFiles(files: List<MediaFile>)
    suspend fun deleteFiles(ids: List<Long>)
    suspend fun updateDownloadStatus(id: Long, status: DownloadStatus, localPath: String?)
    suspend fun downloadFile(file: MediaFile): Result<String>
    suspend fun incrementPlayCount(id: Long)
}
```

```kotlin
// data/repository/MediaRepositoryImpl.kt
package com.appx.data.repository

import com.appx.data.local.database.dao.MediaFileDao
import com.appx.data.local.database.entity.MediaFileEntity
import com.appx.data.remote.api.GoogleDriveApi
import com.appx.domain.model.DownloadStatus
import com.appx.domain.model.MediaFile
import com.appx.domain.model.MediaType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import java.io.File
import javax.inject.Inject

class MediaRepositoryImpl @Inject constructor(
    private val driveApi: GoogleDriveApi,
    private val mediaFileDao: MediaFileDao,
    private val cacheDir: File
) : MediaRepository {

    override suspend fun fetchRemoteFiles(folderId: String): List<MediaFile> {
        return withContext(Dispatchers.IO) {
            val response = driveApi.listFiles(folderId)
            
            response.files
                .mapNotNull { dto ->
                    val extension = dto.name.substringAfterLast('.', "")
                    val mediaType = MediaFile.fromExtension(extension) ?: return@mapNotNull null
                    
                    MediaFile(
                        driveFileId = dto.id,
                        fileName = dto.name,
                        mediaType = mediaType,
                        mimeType = dto.mimeType,
                        fileSizeBytes = dto.size?.toLongOrNull()
                    )
                }
                .sortedBy { it.fileName }
                .mapIndexed { index, file -> file.copy(displayOrder = index) }
        }
    }

    override suspend fun getLocalFiles(): List<MediaFile> {
        return mediaFileDao.getAllFiles().map { it.toDomainModel() }
    }

    override suspend fun getDownloadedFiles(): List<MediaFile> {
        return mediaFileDao.getDownloadedFiles().map { it.toDomainModel() }
    }

    override fun getDownloadedFilesFlow(): Flow<List<MediaFile>> {
        return mediaFileDao.getDownloadedFilesFlow().map { entities ->
            entities.map { it.toDomainModel() }
        }
    }

    override suspend fun insertFiles(files: List<MediaFile>) {
        val entities = files.map { it.toEntity() }
        mediaFileDao.insertAll(entities)
    }

    override suspend fun deleteFiles(ids: List<Long>) {
        // Deletar arquivos do cache também
        ids.forEach { id ->
            mediaFileDao.getFileById(id)?.localPath?.let { path ->
                File(path).delete()
            }
        }
        mediaFileDao.deleteByIds(ids)
    }

    override suspend fun updateDownloadStatus(
        id: Long,
        status: DownloadStatus,
        localPath: String?
    ) {
        mediaFileDao.updateDownloadStatus(id, status.name, localPath)
    }

    override suspend fun downloadFile(file: MediaFile): Result<String> {
        return withContext(Dispatchers.IO) {
            try {
                updateDownloadStatus(file.id, DownloadStatus.DOWNLOADING, null)
                
                val localFile = File(cacheDir, "${file.driveFileId}_${file.fileName}")
                val responseBody = driveApi.downloadFile(file.driveFileId)
                
                localFile.outputStream().use { output ->
                    responseBody.byteStream().use { input ->
                        input.copyTo(output)
                    }
                }
                
                val localPath = localFile.absolutePath
                updateDownloadStatus(file.id, DownloadStatus.COMPLETED, localPath)
                
                Result.success(localPath)
            } catch (e: Exception) {
                updateDownloadStatus(file.id, DownloadStatus.ERROR, null)
                Result.failure(e)
            }
        }
    }

    override suspend fun incrementPlayCount(id: Long) {
        mediaFileDao.incrementPlayCount(id)
    }
}
```

#### 5.2.4 ViewModel (Presentation Layer)

```kotlin
// presentation/player/PlayerViewModel.kt
package com.appx.presentation.player

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appx.domain.model.AppConfig
import com.appx.domain.model.MediaFile
import com.appx.domain.model.PlaybackState
import com.appx.domain.usecase.GetPlaylistUseCase
import com.appx.data.repository.ConfigRepository
import com.appx.data.repository.MediaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import javax.inject.Inject

@HiltViewModel
class PlayerViewModel @Inject constructor(
    private val getPlaylistUseCase: GetPlaylistUseCase,
    private val configRepository: ConfigRepository,
    private val mediaRepository: MediaRepository
) : ViewModel() {

    private val _playbackState = MutableStateFlow<PlaybackState>(PlaybackState.Idle)
    val playbackState: StateFlow<PlaybackState> = _playbackState.asStateFlow()

    private val _playlist = MutableStateFlow<List<MediaFile>>(emptyList())
    val playlist: StateFlow<List<MediaFile>> = _playlist.asStateFlow()

    private val _config = MutableStateFlow(AppConfig())
    val config: StateFlow<AppConfig> = _config.asStateFlow()

    private var currentIndex = 0
    private var imageTimerJob: Job? = null

    init {
        loadConfig()
        observePlaylist()
    }

    private fun loadConfig() {
        viewModelScope.launch {
            configRepository.getConfigFlow().collect { config ->
                _config.value = config
            }
        }
    }

    private fun observePlaylist() {
        viewModelScope.launch {
            getPlaylistUseCase().collect { files ->
                _playlist.value = files
                if (files.isNotEmpty() && _playbackState.value == PlaybackState.Idle) {
                    // Auto-start se configurado
                    if (_config.value.isPlaying) {
                        playFile(0)
                    }
                }
            }
        }
    }

    fun playFile(index: Int) {
        val files = _playlist.value
        if (index !in files.indices) return

        currentIndex = index
        val file = files[index]

        cancelImageTimer()

        viewModelScope.launch {
            mediaRepository.incrementPlayCount(file.id)
        }

        if (file.isImage) {
            startImagePlayback(file, files.size)
        } else {
            _playbackState.value = PlaybackState.PlayingVideo(
                mediaFile = file,
                currentPosition = 0,
                duration = (file.durationSeconds?.toLong() ?: 0) * 1000,
                currentIndex = index,
                totalItems = files.size
            )
        }
    }

    private fun startImagePlayback(file: MediaFile, totalItems: Int) {
        val displayTime = _config.value.imageDisplayTimeSeconds

        _playbackState.value = PlaybackState.PlayingImage(
            mediaFile = file,
            remainingSeconds = displayTime,
            currentIndex = currentIndex,
            totalItems = totalItems
        )

        imageTimerJob = viewModelScope.launch {
            for (remaining in displayTime downTo 1) {
                delay(1000)
                _playbackState.value = PlaybackState.PlayingImage(
                    mediaFile = file,
                    remainingSeconds = remaining - 1,
                    currentIndex = currentIndex,
                    totalItems = totalItems
                )
            }
            playNext()
        }
    }

    fun updateVideoProgress(position: Long, duration: Long) {
        val state = _playbackState.value
        if (state is PlaybackState.PlayingVideo) {
            _playbackState.value = state.copy(
                currentPosition = position,
                duration = duration
            )
        }
    }

    fun onVideoCompleted() {
        playNext()
    }

    fun playNext() {
        viewModelScope.launch {
            val nextFile = getPlaylistUseCase.getNextFile(currentIndex, _config.value.loopEnabled)
            if (nextFile != null) {
                val nextIndex = _playlist.value.indexOfFirst { it.id == nextFile.id }
                if (nextIndex >= 0) {
                    playFile(nextIndex)
                }
            } else {
                _playbackState.value = PlaybackState.Completed
            }
        }
    }

    fun playPrevious() {
        viewModelScope.launch {
            val prevFile = getPlaylistUseCase.getPreviousFile(currentIndex, _config.value.loopEnabled)
            if (prevFile != null) {
                val prevIndex = _playlist.value.indexOfFirst { it.id == prevFile.id }
                if (prevIndex >= 0) {
                    playFile(prevIndex)
                }
            }
        }
    }

    fun pause() {
        cancelImageTimer()
        _playbackState.value = PlaybackState.Paused
    }

    fun resume() {
        val files = _playlist.value
        if (currentIndex in files.indices) {
            playFile(currentIndex)
        }
    }

    fun togglePlayPause() {
        when (_playbackState.value) {
            is PlaybackState.PlayingImage,
            is PlaybackState.PlayingVideo -> pause()
            is PlaybackState.Paused -> resume()
            else -> { /* No action */ }
        }
    }

    private fun cancelImageTimer() {
        imageTimerJob?.cancel()
        imageTimerJob = null
    }

    override fun onCleared() {
        super.onCleared()
        cancelImageTimer()
    }
}
```

#### 5.2.5 Activity Principal (Presentation Layer)

```kotlin
// presentation/player/PlayerActivity.kt
package com.appx.presentation.player

import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import com.appx.databinding.ActivityPlayerBinding
import com.appx.domain.model.PlaybackState
import com.appx.presentation.player.ImagePlayerFragment
import com.appx.presentation.player.VideoPlayerFragment
import com.appx.presentation.player.MenuOverlayFragment
import com.bumptech.glide.Glide
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

@AndroidEntryPoint
class PlayerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPlayerBinding
    private val viewModel: PlayerViewModel by viewModels()
    
    private var isMenuVisible = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configurar fullscreen para TV
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        )

        observePlaybackState()
    }

    private fun observePlaybackState() {
        lifecycleScope.launch {
            viewModel.playbackState.collectLatest { state ->
                updateUI(state)
            }
        }
    }

    private fun updateUI(state: PlaybackState) {
        when (state) {
            is PlaybackState.Idle -> {
                showLoadingIndicator()
            }
            
            is PlaybackState.Loading -> {
                showLoadingIndicator()
            }
            
            is PlaybackState.PlayingImage -> {
                hideLoadingIndicator()
                showImageFragment(state)
                updateProgressInfo(state.currentIndex, state.totalItems, state.remainingSeconds)
            }
            
            is PlaybackState.PlayingVideo -> {
                hideLoadingIndicator()
                showVideoFragment(state)
                updateProgressInfo(state.currentIndex, state.totalItems, null)
            }
            
            is PlaybackState.Paused -> {
                showPausedOverlay()
            }
            
            is PlaybackState.Completed -> {
                showCompletedMessage()
            }
            
            is PlaybackState.Error -> {
                showErrorMessage(state.message)
            }
        }
    }

    private fun showImageFragment(state: PlaybackState.PlayingImage) {
        val fragment = ImagePlayerFragment.newInstance(
            localPath = state.mediaFile.localPath ?: return,
            fileName = state.mediaFile.fileName
        )
        
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }

    private fun showVideoFragment(state: PlaybackState.PlayingVideo) {
        val fragment = VideoPlayerFragment.newInstance(
            localPath = state.mediaFile.localPath ?: return,
            fileName = state.mediaFile.fileName
        )
        
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }

    private fun updateProgressInfo(current: Int, total: Int, remainingSeconds: Int?) {
        binding.tvProgress.text = "${current + 1} / $total"
        binding.tvTimer.isVisible = remainingSeconds != null
        remainingSeconds?.let {
            binding.tvTimer.text = "${it}s"
        }
    }

    private fun showLoadingIndicator() {
        binding.progressBar.isVisible = true
    }

    private fun hideLoadingIndicator() {
        binding.progressBar.isVisible = false
    }

    private fun showPausedOverlay() {
        binding.pausedOverlay.isVisible = true
    }

    private fun hidePausedOverlay() {
        binding.pausedOverlay.isVisible = false
    }

    private fun showCompletedMessage() {
        binding.tvStatus.text = "Reprodução finalizada"
        binding.tvStatus.isVisible = true
    }

    private fun showErrorMessage(message: String) {
        binding.tvStatus.text = "Erro: $message"
        binding.tvStatus.isVisible = true
    }

    private fun toggleMenu() {
        isMenuVisible = !isMenuVisible
        
        if (isMenuVisible) {
            val menuFragment = MenuOverlayFragment()
            supportFragmentManager.beginTransaction()
                .add(R.id.menuContainer, menuFragment)
                .commit()
        } else {
            supportFragmentManager.findFragmentById(R.id.menuContainer)?.let {
                supportFragmentManager.beginTransaction()
                    .remove(it)
                    .commit()
            }
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_DPAD_CENTER,
            KeyEvent.KEYCODE_ENTER -> {
                if (isMenuVisible) {
                    // Menu handles its own navigation
                    false
                } else {
                    toggleMenu()
                    true
                }
            }
            
            KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE -> {
                viewModel.togglePlayPause()
                true
            }
            
            KeyEvent.KEYCODE_MEDIA_NEXT,
            KeyEvent.KEYCODE_DPAD_RIGHT -> {
                if (!isMenuVisible) {
                    viewModel.playNext()
                    true
                } else false
            }
            
            KeyEvent.KEYCODE_MEDIA_PREVIOUS,
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                if (!isMenuVisible) {
                    viewModel.playPrevious()
                    true
                } else false
            }
            
            KeyEvent.KEYCODE_BACK -> {
                if (isMenuVisible) {
                    toggleMenu()
                    true
                } else {
                    finish()
                    true
                }
            }
            
            else -> super.onKeyDown(keyCode, event)
        }
    }
}
```

---

## 🔐 PARTE 6: AUTENTICAÇÃO

### 6.1 Fluxo de Autenticação Google OAuth 2.0

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE AUTENTICAÇÃO OAUTH 2.0                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐        ┌─────────────┐        ┌─────────────────────┐     │
│  │  APPX   │        │   Google    │        │    Google Drive     │     │
│  │   TV    │        │   OAuth     │        │        API          │     │
│  └────┬────┘        └──────┬──────┘        └──────────┬──────────┘     │
│       │                    │                          │                 │
│       │  1. Exibir código  │                          │                 │
│       │     de pareamento  │                          │                 │
│       │◄───────────────────│                          │                 │
│       │                    │                          │                 │
│       │  2. Usuário acessa │                          │                 │
│       │     URL e insere   │                          │                 │
│       │     código no      │                          │                 │
│       │     celular/PC     │                          │                 │
│       │───────────────────►│                          │                 │
│       │                    │                          │                 │
│       │  3. Polling para   │                          │                 │
│       │     verificar      │                          │                 │
│       │     autorização    │                          │                 │
│       │◄──────────────────►│                          │                 │
│       │                    │                          │                 │
│       │  4. Receber tokens │                          │                 │
│       │     (access +      │                          │                 │
│       │     refresh)       │                          │                 │
│       │◄───────────────────│                          │                 │
│       │                    │                          │                 │
│       │  5. Usar access    │                          │                 │
│       │     token para     │                          │                 │
│       │     requisições    │                          │                 │
│       │──────────────────────────────────────────────►│                 │
│       │                    │                          │                 │
│       │  6. Retornar       │                          │                 │
│       │     arquivos       │                          │                 │
│       │◄──────────────────────────────────────────────│                 │
│       │                    │                          │                 │
└───────┴────────────────────┴──────────────────────────┴─────────────────┘
```

### 6.2 Implementação OAuth (Device Flow para TV)

```kotlin
// data/remote/auth/GoogleAuthManager.kt
package com.appx.data.remote.auth

import android.content.Context
import com.appx.data.local.preferences.AppPreferences
import com.appx.util.EncryptionUtils
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

sealed class AuthState {
    object NotAuthenticated : AuthState()
    data class WaitingForUserAuth(
        val userCode: String,
        val verificationUrl: String,
        val expiresIn: Int
    ) : AuthState()
    object Authenticating : AuthState()
    object Authenticated : AuthState()
    data class Error(val message: String) : AuthState()
}

@Singleton
class GoogleAuthManager @Inject constructor(
    private val context: Context,
    private val preferences: AppPreferences,
    private val httpClient: OkHttpClient
) {
    companion object {
        private const val CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com"
        private const val DEVICE_CODE_URL = "https://oauth2.googleapis.com/device/code"
        private const val TOKEN_URL = "https://oauth2.googleapis.com/token"
        private const val SCOPE = "https://www.googleapis.com/auth/drive.readonly"
    }

    private val _authState = MutableStateFlow<AuthState>(AuthState.NotAuthenticated)
    val authState: StateFlow<AuthState> = _authState

    private var pollingJob: Job? = null

    suspend fun checkExistingAuth(): Boolean {
        val accessToken = preferences.getAccessToken()
        val tokenExpiry = preferences.getTokenExpiry()

        return if (accessToken != null && tokenExpiry > System.currentTimeMillis()) {
            _authState.value = AuthState.Authenticated
            true
        } else if (preferences.getRefreshToken() != null) {
            refreshAccessToken()
        } else {
            false
        }
    }

    suspend fun startDeviceAuth() {
        _authState.value = AuthState.Authenticating

        try {
            val requestBody = FormBody.Builder()
                .add("client_id", CLIENT_ID)
                .add("scope", SCOPE)
                .build()

            val request = Request.Builder()
                .url(DEVICE_CODE_URL)
                .post(requestBody)
                .build()

            val response = withContext(Dispatchers.IO) {
                httpClient.newCall(request).execute()
            }

            if (!response.isSuccessful) {
                throw Exception("Device code request failed: ${response.code}")
            }

            val json = JSONObject(response.body?.string() ?: "")
            val deviceCode = json.getString("device_code")
            val userCode = json.getString("user_code")
            val verificationUrl = json.getString("verification_url")
            val expiresIn = json.getInt("expires_in")
            val interval = json.getInt("interval")

            _authState.value = AuthState.WaitingForUserAuth(
                userCode = userCode,
                verificationUrl = verificationUrl,
                expiresIn = expiresIn
            )

            startPolling(deviceCode, interval)

        } catch (e: Exception) {
            _authState.value = AuthState.Error(e.message ?: "Authentication failed")
        }
    }

    private fun startPolling(deviceCode: String, interval: Int) {
        pollingJob?.cancel()
        pollingJob = CoroutineScope(Dispatchers.IO).launch {
            val pollInterval = interval * 1000L
            
            while (isActive) {
                delay(pollInterval)
                
                try {
                    val requestBody = FormBody.Builder()
                        .add("client_id", CLIENT_ID)
                        .add("device_code", deviceCode)
                        .add("grant_type", "urn:ietf:params:oauth:grant-type:device_code")
                        .build()

                    val request = Request.Builder()
                        .url(TOKEN_URL)
                        .post(requestBody)
                        .build()

                    val response = httpClient.newCall(request).execute()
                    val json = JSONObject(response.body?.string() ?: "")

                    if (response.isSuccessful) {
                        val accessToken = json.getString("access_token")
                        val refreshToken = json.optString("refresh_token")
                        val expiresIn = json.getInt("expires_in")

                        saveTokens(accessToken, refreshToken, expiresIn)
                        _authState.value = AuthState.Authenticated
                        break
                    } else {
                        val error = json.optString("error")
                        when (error) {
                            "authorization_pending" -> continue
                            "slow_down" -> delay(5000)
                            "expired_token" -> {
                                _authState.value = AuthState.Error("Authorization expired")
                                break
                            }
                            "access_denied" -> {
                                _authState.value = AuthState.Error("Access denied by user")
                                break
                            }
                            else -> {
                                _authState.value = AuthState.Error("Unknown error: $error")
                                break
                            }
                        }
                    }
                } catch (e: Exception) {
                    _authState.value = AuthState.Error(e.message ?: "Polling failed")
                    break
                }
            }
        }
    }

    private suspend fun refreshAccessToken(): Boolean {
        val refreshToken = preferences.getRefreshToken() ?: return false

        return try {
            val requestBody = FormBody.Builder()
                .add("client_id", CLIENT_ID)
                .add("refresh_token", EncryptionUtils.decrypt(refreshToken))
                .add("grant_type", "refresh_token")
                .build()

            val request = Request.Builder()
                .url(TOKEN_URL)
                .post(requestBody)
                .build()

            val response = withContext(Dispatchers.IO) {
                httpClient.newCall(request).execute()
            }

            if (response.isSuccessful) {
                val json = JSONObject(response.body?.string() ?: "")
                val accessToken = json.getString("access_token")
                val expiresIn = json.getInt("expires_in")

                saveTokens(accessToken, null, expiresIn)
                _authState.value = AuthState.Authenticated
                true
            } else {
                false
            }
        } catch (e: Exception) {
            false
        }
    }

    private suspend fun saveTokens(accessToken: String, refreshToken: String?, expiresIn: Int) {
        val expiryTime = System.currentTimeMillis() + (expiresIn * 1000)
        
        preferences.setAccessToken(EncryptionUtils.encrypt(accessToken))
        preferences.setTokenExpiry(expiryTime)
        
        refreshToken?.let {
            preferences.setRefreshToken(EncryptionUtils.encrypt(it))
        }
    }

    fun getAccessToken(): String? {
        return preferences.getAccessToken()?.let { 
            EncryptionUtils.decrypt(it) 
        }
    }

    fun logout() {
        pollingJob?.cancel()
        preferences.clearTokens()
        _authState.value = AuthState.NotAuthenticated
    }
}
```

---

## 🚀 PARTE 7: DEPLOY E CI/CD

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/android-build.yml
name: Android CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ created ]

env:
  JAVA_VERSION: '17'
  ANDROID_COMPILE_SDK: '34'
  ANDROID_BUILD_TOOLS: '34.0.0'

jobs:
  lint:
    name: Lint Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: gradle

      - name: Run lint
        run: ./gradlew lint

      - name: Upload lint results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lint-results
          path: app/build/reports/lint-results-*.html

  unit-test:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: gradle

      - name: Run unit tests
        run: ./gradlew testDebugUnitTest

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: unit-test-results
          path: app/build/reports/tests/

  build-debug:
    name: Build Debug APK
    runs-on: ubuntu-latest
    needs: [lint, unit-test]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: gradle

      - name: Build Debug APK
        run: ./gradlew assembleDebug

      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk

  build-release:
    name: Build Release APK
    runs-on: ubuntu-latest
    needs: [lint, unit-test]
    if: github.event_name == 'release'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: gradle

      - name: Decode Keystore
        run: |
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > app/keystore.jks

      - name: Build Release APK
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: ./gradlew assembleRelease

      - name: Upload Release APK
        uses: actions/upload-artifact@v4
        with:
          name: release-apk
          path: app/build/outputs/apk/release/app-release.apk

  deploy-firebase:
    name: Deploy to Firebase App Distribution
    runs-on: ubuntu-latest
    needs: build-release
    if: github.event_name == 'release'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download Release APK
        uses: actions/download-artifact@v4
        with:
          name: release-apk
          path: ./

      - name: Upload to Firebase App Distribution
        uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          appId: ${{ secrets.FIREBASE_APP_ID }}
          serviceCredentialsFileContent: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          groups: testers
          file: app-release.apk
          releaseNotes: |
            Release ${{ github.event.release.tag_name }}
            ${{ github.event.release.body }}
```

### 7.2 Script de Build Local

```bash
#!/bin/bash
# build.sh - Script de build local

set -e

echo "=== APPX Build Script ==="

# Variáveis
BUILD_TYPE=${1:-debug}
VERSION_NAME="1.0.0"
VERSION_CODE=$(date +%Y%m%d%H)

echo "Build Type: $BUILD_TYPE"
echo "Version: $VERSION_NAME ($VERSION_CODE)"

# Limpar builds anteriores
echo "Limpando builds anteriores..."
./gradlew clean

# Executar testes
echo "Executando testes..."
./gradlew testDebugUnitTest

# Build
if [ "$BUILD_TYPE" == "release" ]; then
    echo "Building Release APK..."
    ./gradlew assembleRelease \
        -PversionName=$VERSION_NAME \
        -PversionCode=$VERSION_CODE
    
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    echo "Building Debug APK..."
    ./gradlew assembleDebug \
        -PversionName=$VERSION_NAME \
        -PversionCode=$VERSION_CODE
    
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

# Verificar se APK foi gerado
if [ -f "$APK_PATH" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📦 APK gerado em: $APK_PATH"
    
    # Copiar para pasta de output
    mkdir -p ./output
    cp "$APK_PATH" "./output/appx-$BUILD_TYPE-$VERSION_NAME.apk"
    
    echo "📁 APK copiado para: ./output/appx-$BUILD_TYPE-$VERSION_NAME.apk"
else
    echo "❌ Erro: APK não foi gerado"
    exit 1
fi

echo "=== Build finalizado ==="
```

---

## ✅ PARTE 8: TESTES

### 8.1 Testes Unitários

```kotlin
// test/domain/usecase/SyncMediaFilesUseCaseTest.kt
package com.appx.domain.usecase

import com.appx.data.repository.ConfigRepository
import com.appx.data.repository.MediaRepository
import com.appx.domain.model.AppConfig
import com.appx.domain.model.MediaFile
import com.appx.domain.model.MediaType
import com.appx.domain.model.SyncStatus
import io.mockk.*
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class SyncMediaFilesUseCaseTest {

    private lateinit var mediaRepository: MediaRepository
    private lateinit var configRepository: ConfigRepository
    private lateinit var useCase: SyncMediaFilesUseCase

    @Before
    fun setup() {
        mediaRepository = mockk()
        configRepository = mockk()
        useCase = SyncMediaFilesUseCase(mediaRepository, configRepository)
    }

    @Test
    fun `sync should emit Success when files are fetched`() = runTest {
        // Given
        val config = AppConfig(driveFolderUrl = "https://drive.google.com/drive/folders/abc123")
        val remoteFiles = listOf(
            MediaFile(
                id = 0,
                driveFileId = "file1",
                fileName = "image1.jpg",
                mediaType = MediaType.IMAGE,
                mimeType = "image/jpeg"
            )
        )
        
        coEvery { configRepository.getConfig() } returns config
        coEvery { mediaRepository.fetchRemoteFiles("abc123") } returns remoteFiles
        coEvery { mediaRepository.getLocalFiles() } returns emptyList()
        coEvery { mediaRepository.insertFiles(any()) } just Runs
        coEvery { mediaRepository.deleteFiles(any()) } just Runs
        coEvery { configRepository.updateLastSync(any()) } just Runs

        // When
        val results = useCase().toList()

        // Then
        assertTrue(results[0] is SyncStatus.Syncing)
        assertTrue(results[1] is SyncStatus.Success)
        
        val success = results[1] as SyncStatus.Success
        assertEquals(1, success.newFilesCount)
        assertEquals(0, success.removedFilesCount)
        assertEquals(1, success.totalFiles)
    }

    @Test
    fun `sync should emit Error when folder ID is not configured`() = runTest {
        // Given
        val config = AppConfig(driveFolderUrl = "")
        coEvery { configRepository.getConfig() } returns config

        // When
        val results = useCase().toList()

        // Then
        assertTrue(results[0] is SyncStatus.Syncing)
        assertTrue(results[1] is SyncStatus.Error)
    }

    @Test
    fun `sync should detect removed files`() = runTest {
        // Given
        val config = AppConfig(driveFolderUrl = "https://drive.google.com/drive/folders/abc123")
        val localFile = MediaFile(
            id = 1,
            driveFileId = "oldFile",
            fileName = "old.jpg",
            mediaType = MediaType.IMAGE,
            mimeType = "image/jpeg"
        )
        
        coEvery { configRepository.getConfig() } returns config
        coEvery { mediaRepository.fetchRemoteFiles("abc123") } returns emptyList()
        coEvery { mediaRepository.getLocalFiles() } returns listOf(localFile)
        coEvery { mediaRepository.insertFiles(any()) } just Runs
        coEvery { mediaRepository.deleteFiles(listOf(1L)) } just Runs
        coEvery { configRepository.updateLastSync(any()) } just Runs

        // When
        val results = useCase().toList()

        // Then
        val success = results[1] as SyncStatus.Success
        assertEquals(0, success.newFilesCount)
        assertEquals(1, success.removedFilesCount)
        
        coVerify { mediaRepository.deleteFiles(listOf(1L)) }
    }
}
```

### 8.2 Testes de Integração

```kotlin
// androidTest/data/repository/MediaRepositoryIntegrationTest.kt
package com.appx.data.repository

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.appx.data.local.database.AppDatabase
import com.appx.data.local.database.dao.MediaFileDao
import com.appx.domain.model.DownloadStatus
import com.appx.domain.model.MediaFile
import com.appx.domain.model.MediaType
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@RunWith(AndroidJUnit4::class)
class MediaRepositoryIntegrationTest {

    private lateinit var database: AppDatabase
    private lateinit var mediaFileDao: MediaFileDao
    private lateinit var repository: MediaRepositoryImpl
    private lateinit var cacheDir: File

    @Before
    fun setup() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        
        mediaFileDao = database.mediaFileDao()
        cacheDir = context.cacheDir
        
        // Criar repository com mock do API
        repository = MediaRepositoryImpl(
            driveApi = mockk(),
            mediaFileDao = mediaFileDao,
            cacheDir = cacheDir
        )
    }

    @After
    fun teardown() {
        database.close()
    }

    @Test
    fun insertAndRetrieveFiles() = runTest {
        // Given
        val files = listOf(
            MediaFile(
                driveFileId = "file1",
                fileName = "test1.jpg",
                mediaType = MediaType.IMAGE,
                mimeType = "image/jpeg"
            ),
            MediaFile(
                driveFileId = "file2",
                fileName = "test2.mp4",
                mediaType = MediaType.VIDEO,
                mimeType = "video/mp4"
            )
        )

        // When
        repository.insertFiles(files)
        val retrieved = repository.getLocalFiles()

        // Then
        assertEquals(2, retrieved.size)
        assertTrue(retrieved.any { it.driveFileId == "file1" })
        assertTrue(retrieved.any { it.driveFileId == "file2" })
    }

    @Test
    fun updateDownloadStatus() = runTest {
        // Given
        val file = MediaFile(
            driveFileId = "file1",
            fileName = "test.jpg",
            mediaType = MediaType.IMAGE,
            mimeType = "image/jpeg"
        )
        repository.insertFiles(listOf(file))
        val inserted = repository.getLocalFiles().first()

        // When
        repository.updateDownloadStatus(
            id = inserted.id,
            status = DownloadStatus.COMPLETED,
            localPath = "/path/to/file"
        )

        // Then
        val updated = repository.getLocalFiles().first()
        assertEquals(DownloadStatus.COMPLETED, updated.downloadStatus)
        assertEquals("/path/to/file", updated.localPath)
    }

    @Test
    fun getDownloadedFilesFlow() = runTest {
        // Given
        val files = listOf(
            MediaFile(
                driveFileId = "file1",
                fileName = "test1.jpg",
                mediaType = MediaType.IMAGE,
                mimeType = "image/jpeg",
                downloadStatus = DownloadStatus.COMPLETED,
                localPath = "/path1"
            ),
            MediaFile(
                driveFileId = "file2",
                fileName = "test2.jpg",
                mediaType = MediaType.IMAGE,
                mimeType = "image/jpeg",
                downloadStatus = DownloadStatus.PENDING
            )
        )
        repository.insertFiles(files)

        // When
        val downloaded = repository.getDownloadedFilesFlow().first()

        // Then
        assertEquals(1, downloaded.size)
        assertEquals("file1", downloaded[0].driveFileId)
    }
}
```

### 8.3 Testes de UI (Espresso + Leanback)

```kotlin
// androidTest/presentation/settings/SettingsActivityTest.kt
package com.appx.presentation.settings

import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.appx.R
import dagger.hilt.android.testing.HiltAndroidRule
import dagger.hilt.android.testing.HiltAndroidTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@HiltAndroidTest
@RunWith(AndroidJUnit4::class)
class SettingsActivityTest {

    @get:Rule
    val hiltRule = HiltAndroidRule(this)

    @Before
    fun setup() {
        hiltRule.inject()
    }

    @Test
    fun settingsActivity_displaysAllFields() {
        // Given
        ActivityScenario.launch(SettingsActivity::class.java)

        // Then
        onView(withId(R.id.etDriveUrl))
            .check(matches(isDisplayed()))
        
        onView(withId(R.id.sliderImageTime))
            .check(matches(isDisplayed()))
        
        onView(withId(R.id.sliderSyncInterval))
            .check(matches(isDisplayed()))
        
        onView(withId(R.id.btnSave))
            .check(matches(isDisplayed()))
    }

    @Test
    fun settingsActivity_savesConfiguration() {
        // Given
        ActivityScenario.launch(SettingsActivity::class.java)

        // When
        onView(withId(R.id.etDriveUrl))
            .perform(clearText(), typeText("https://drive.google.com/drive/folders/test123"))
        
        onView(withId(R.id.btnSave))
            .perform(click())

        // Then
        onView(withText("Configurações salvas"))
            .check(matches(isDisplayed()))
    }

    @Test
    fun settingsActivity_validatesEmptyUrl() {
        // Given
        ActivityScenario.launch(SettingsActivity::class.java)

        // When
        onView(withId(R.id.etDriveUrl))
            .perform(clearText())
        
        onView(withId(R.id.btnSave))
            .perform(click())

        // Then
        onView(withText("URL da pasta é obrigatória"))
            .check(matches(isDisplayed()))
    }
}
```

---

## 📝 PARTE 9: CHECKLIST DE CODE REVIEW

### 9.1 Checklist de Qualidade

```markdown
## CODE REVIEW CHECKLIST - APPX

### Arquitetura
- [ ] Código segue Clean Architecture (Data → Domain → Presentation)
- [ ] Injeção de dependência configurada corretamente (Hilt)
- [ ] Single Responsibility Principle respeitado
- [ ] Interfaces definidas para abstrações
- [ ] ViewModels não têm referências ao Android Framework

### Kotlin Best Practices
- [ ] Uso correto de coroutines e Flow
- [ ] Null safety implementado (evitar !!)
- [ ] Data classes para modelos
- [ ] Sealed classes para estados
- [ ] Extension functions bem definidas
- [ ] Constantes em companion objects ou arquivos dedicados

### Android/TV Específico
- [ ] Navegação por D-pad funcional
- [ ] Focus states visíveis em todos elementos interativos
- [ ] Layouts responsivos para diferentes resoluções de TV
- [ ] Leanback library utilizada corretamente
- [ ] ExoPlayer configurado para performance
- [ ] Lifecycle awareness em componentes

### Segurança
- [ ] Credenciais criptografadas (EncryptedSharedPreferences)
- [ ] Tokens OAuth armazenados com segurança
- [ ] Network Security Config definido
- [ ] ProGuard/R8 configurado para release
- [ ] Logs sensíveis removidos em produção

### Performance
- [ ] Operações de I/O em Dispatchers.IO
- [ ] Imagens carregadas com Glide/Coil (cache ativado)
- [ ] RecyclerView com ViewHolder pattern
- [ ] Memory leaks verificados (LeakCanary)
- [ ] ANRs prevenidos (nenhuma operação longa na Main thread)

### Testes
- [ ] Cobertura mínima de 80% em Use Cases
- [ ] Testes de repository com Room in-memory
- [ ] Testes de UI com Espresso
- [ ] Mocks utilizados corretamente (MockK)
- [ ] Edge cases cobertos

### Documentação
- [ ] KDoc em classes e funções públicas
- [ ] README atualizado
- [ ] Changelog mantido
- [ ] Comentários relevantes (não óbvios)
```

---

## 📅 PARTE 10: CRONOGRAMA DE DESENVOLVIMENTO

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CRONOGRAMA - APPX DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SPRINT 1 (Semana 1-2): Fundação                                       │
│  ├── Setup do projeto Android TV                                       │
│  ├── Configuração Hilt, Room, Retrofit                                 │
│  ├── Implementação do banco de dados local                             │
│  └── Tela de Splash básica                                             │
│                                                                         │
│  SPRINT 2 (Semana 3-4): Core Features                                  │
│  ├── Integração Google Drive API                                       │
│  ├── Autenticação OAuth 2.0 (Device Flow)                              │
│  ├── Download e cache de arquivos                                      │
│  └── Tela de Configurações completa                                    │
│                                                                         │
│  SPRINT 3 (Semana 5-6): Media Player                                   │
│  ├── Player de imagens com timer                                       │
│  ├── Player de vídeo com ExoPlayer                                     │
│  ├── Playlist sequencial                                               │
│  └── Controles por D-pad                                               │
│                                                                         │
│  SPRINT 4 (Semana 7-8): Polish & Deploy                                │
│  ├── Sincronização automática em background                            │
│  ├── Menu overlay                                                      │
│  ├── Testes automatizados                                              │
│  ├── CI/CD pipeline                                                    │
│  └── Release build e distribuição                                      │
│                                                                         │
│  MILESTONE: v1.0.0 Release ────────────────────────► Semana 8          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 RESUMO EXECUTIVO PARA IA

```yaml
projeto: APPX
tipo: Android TV Application
objetivo: Exibição de anúncios via Google Drive

stack_principal:
  linguagem: Kotlin
  framework: Android TV (Leanback)
  arquitetura: Clean Architecture + MVVM
  di: Hilt
  database: Room (SQLite)
  network: Retrofit + OkHttp
  player: ExoPlayer + Glide
  auth: Google OAuth 2.0 (Device Flow)

funcionalidades_core:
  - Conectar pasta Google Drive via URL
  - Baixar e cachear imagens/vídeos
  - Exibir imagens por tempo configurável
  - Reproduzir vídeos até o fim
  - Playlist sequencial com loop
  - Sincronização automática
  - Navegação por controle remoto

endpoints_google_drive:
  list_files: "GET /drive/v3/files?q='FOLDER_ID'+in+parents"
  download: "GET /drive/v3/files/FILE_ID?alt=media"
  auth_device: "POST https://oauth2.googleapis.com/device/code"
  auth_token: "POST https://oauth2.googleapis.com/token"

estrutura_banco:
  tabelas:
    - app_config (configurações do app)
    - media_files (arquivos de mídia)
    - playback_logs (logs de reprodução)
    - credentials (tokens criptografados)

fluxo_principal:
  1. Splash -> Verificar autenticação
  2. Settings -> Configurar URL e parâmetros
  3. Sync -> Baixar lista de arquivos
  4. Download -> Cachear arquivos localmente
  5. Player -> Reproduzir sequencialmente
  6. Loop -> Repetir playlist

testes_requeridos:
  - unit: Use Cases, Repositories
  - integration: Database, API
  - ui: Espresso, Leanback test

deploy:
  ci_cd: GitHub Actions
  distribuicao: Firebase App Distribution
  monitoramento: Firebase Crashlytics
```

---

**FIM DO DOCUMENTO DE ENGENHARIA DE SOFTWARE - APPX v1.0**
