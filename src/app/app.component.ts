import { Component, OnInit } from '@angular/core';
import { format } from 'sql-formatter';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/fullscreen';

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
      extraKeys: {
        F11: (cm) => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        Esc: (cm) => cm.setOption('fullScreen', false),
        'Ctrl-R': () => console.log('Ctrl-R'),
        'Ctrl-Enter': () => console.log('Ctrl-Enter'),
        'Ctrl-F': () => this.format(),
        'Ctrl-Q': () => console.log('Ctrl-Q'),
      },
    });
    this.editor.doc.setValue(this.sql);
  }

  format() {
    const curSql = this.editor.doc.getValue();
    const formattedSql = format(curSql, { keywordCase: 'lower' });
    this.editor.doc.setValue(formattedSql);
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
}
