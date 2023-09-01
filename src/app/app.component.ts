import { Component, OnInit } from '@angular/core';
import { format } from 'sql-formatter';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/active-line';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  sql = 'SELECT * FROM customers WHERE age > 18';
  editor: any;

  ngOnInit(): void {
    const textarea = document.querySelector('.textarea') as HTMLTextAreaElement;
    this.editor = CodeMirror.fromTextArea(textarea, {
      mode: 'text/x-sql',
      theme: 'idea',
      lineNumbers: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
    });
    this.editor.doc.setValue(this.sql);
  }

  format() {
    const curSql = this.editor.doc.getValue();
    const formattedSql = format(curSql, { keywordCase: 'lower' });
    this.editor.doc.setValue(formattedSql);
  }
}
