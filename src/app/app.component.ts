import { Component, OnInit } from '@angular/core';
import { format } from 'sql-formatter';
import { Observable, of } from 'rxjs';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  sql = 'SELECT * FROM customers WHERE age > 18';
  editor: any;

  row = 0;
  col = 0;

  from = {
    line: 0,
    ch: 0,
  };

  to = {
    line: 0,
    ch: 0,
  };

  lintMessage: any = [
    {
      message: '错误信息',
      severity: 'error',
      from: { line: this.from.line, ch: this.from.ch },
      to: { line: this.to.line, ch: this.to.ch },
    },
  ];

  ngOnInit(): void {
    const textarea = document.querySelector('.textarea') as HTMLTextAreaElement;
    this.editor = CodeMirror.fromTextArea(textarea, {
      mode: 'text/x-sql',
      theme: 'idea',
      lineNumbers: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      gutters: ['CodeMirror-lint-markers'],
      lint: {
        getAnnotations: () => [],
      },
      extraKeys: {
        F11: (cm) => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        Esc: (cm) => cm.setOption('fullScreen', false),
        'Ctrl-R': () => console.log('Ctrl-R'),
        'Ctrl-Enter': () => console.log('Ctrl-Enter'),
        'Ctrl-F': () => this.format(),
        'Ctrl-Q': () => this.validate(),
      },
    });
    this.editor.setValue(this.sql);
    this.editor.on('cursorActivity', () => {
      const cursor = this.editor.getCursor();
      this.row = cursor.line + 1;
      this.col = cursor.ch + 1;
    });
  }

  format() {
    const curSql = this.editor.getValue();
    const formattedSql = format(curSql, { keywordCase: 'lower' });
    this.editor.setValue(formattedSql);
  }

  // 标记文本
  markText() {
    const from: CodeMirror.Position = { line: 0, ch: 0 };
    const to: CodeMirror.Position = { line: 0, ch: 5 };
    const options: CodeMirror.TextMarkerOptions = {
      className: 'CodeMirror-lint-mark CodeMirror-lint-mark-error',
      // css: 'text-decoration: underline wavy red;',
    };
    this.editor.markText(from, to, options);
  }

  validate() {
    // TODO: 会同时返回多处报错吗
    this.validateMock().subscribe({
      next: (res) => {
        this.lintMessage = res;
        this.editor.setOption('lint', {
          getAnnotations: () => this.lintMessage,
        });
      },
    });
  }

  validateMock(): Observable<any> {
    return of([
      {
        message: '错误信息',
        severity: 'error',
        from: CodeMirror.Pos(this.from.line, this.from.ch),
        to: CodeMirror.Pos(this.to.line, this.to.ch),
      },
    ]);
  }
}

/**
 * 快捷键
 * ctrl+r / ctrl+enter -> 执行 done
 * ctrl+f -> 格式化 done
 * ctrl+q -> 语法校验 done
 * ctrl+z -> 回退 done
 * tab -> 自动联想(不做)
 * F11 -> 全屏 done
 * ESC -> 退出全屏 done
 */
