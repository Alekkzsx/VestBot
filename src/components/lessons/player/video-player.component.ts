import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-video-player',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative aspect-video bg-black rounded-[2.5rem] shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden border border-white/5 group">
      <div id="yt-player-container" class="w-full h-full"></div>
      @if (!videoLoaded()) {
        <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-100 z-10">
          <div class="relative">
            <div class="w-20 h-20 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <i class="fas fa-play absolute inset-0 flex items-center justify-center text-blue-500 text-2xl"></i>
          </div>
          <div class="text-center">
            <h4 class="text-slate-900 font-bold text-lg">Preparando sua Aula</h4>
            <p class="text-slate-500 text-xs mt-1 uppercase tracking-widest font-black">Carregando Conexão Estelar...</p>
          </div>
        </div>
      }
    </div>
  `
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
    @Input({ required: true }) videoId!: string;
    @Output() videoEnded = new EventEmitter<void>();

    videoLoaded = signal(false);
    private player: any;

    ngOnInit() {
        this.initYoutubePlayer();
    }

    ngOnDestroy() {
        if (this.player && this.player.destroy) {
            this.player.destroy();
        }
    }

    private initYoutubePlayer() {
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        (window as any).onYouTubeIframeAPIReady = () => this.createPlayer();

        if ((window as any).YT && (window as any).YT.Player) {
            this.createPlayer();
        }
    }

    private createPlayer() {
        this.player = new (window as any).YT.Player('yt-player-container', {
            videoId: this.videoId,
            playerVars: {
                'autoplay': 1,
                'rel': 0,
                'modestbranding': 1
            },
            events: {
                'onReady': () => this.videoLoaded.set(true),
                'onStateChange': (event: any) => {
                    if (event.data === 0) { // YT.PlayerState.ENDED
                        this.videoEnded.emit();
                    }
                }
            }
        });
    }
}
