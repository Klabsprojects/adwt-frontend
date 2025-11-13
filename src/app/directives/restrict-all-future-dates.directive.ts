import { Directive, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[restrictAllFutureDates]',

})
export class RestrictAllFutureDatesDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.el.nativeElement.setAttribute('max', today);
  }

  // Prevent manual typing
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}
