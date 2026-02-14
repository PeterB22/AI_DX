import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { MarkdownService } from '../../providers/markdown.service';

@Component({
  selector: 'app-article',
  template: '',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent {

  private markdownService = inject(MarkdownService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input() set article(value: string | undefined) {
    if (value) {
      const text = this.markdownService.parse(value) as string;
      this.setContentChunk(text);
    }
  }

  private setContentChunk(text: string, speed = 5) {
    let index = 0;
    const length = text.length;
    const interval = setInterval(() => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', text.slice(0, index));
      index++;

      if (index > length) {
        clearInterval(interval);
      }
    }, speed);
  }
}
