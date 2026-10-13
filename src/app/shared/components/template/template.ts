import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from '../header/header';


@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule, Header],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {}
