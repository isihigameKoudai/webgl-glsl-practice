(() => {
  // 変数宣言
  let a, b, d, e, z;

  // document.getElementByIdをローカル変数に
  b = function (s) {
    return document.getElementById(s);
  };

  // ESCキーで描画を止めるためのイベントハンドラ
  window.addEventListener("keydown", k, true);

  // HTMLドキュメント内のcanvasへの参照
  const $canvas = b("canvas");

  // WebGLコンテキストの取得
  const gl = $canvas.getContext("webgl");

  // プログラムオブジェクトの生成
  const program = gl.createProgram();

  // シェーダ生成関数
  const h = (i, glsl) => {
    // シェーダオブジェクト生成
    const shaderObj = gl.createShader(gl.VERTEX_SHADER - i);

    // ソースの割り当て
    gl.shaderSource(shaderObj, glsl);

    // シェーダのコンパイル
    gl.compileShader(shaderObj);

    // シェーダのアタッチ
    gl.attachShader(program, shaderObj);

    // ログをリターン
    return gl.getShaderInfoLog(shaderObj);
  };

  // シェーダのコンパイルとリンク
  if (!h(0, b("vs").text) && !h(1, b("fs").text)) gl.linkProgram(program);

  // シェーダのリンクステータスをチェック
  e = gl.getProgramParameter(program, gl.LINK_STATUS);

  // プログラムオブジェクトの有効化
  gl.useProgram(program);

  // uniformLocation格納用にオブジェクトを定義
  const uniform = {
    time: gl.getUniformLocation(program, "time"),
    resolution: gl.getUniformLocation(program, "resolution"),
  };

  // VBO用のバッファオブジェクトを生成
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

  // VBOに頂点データを登録
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0]),
    gl.STATIC_DRAW,
  );

  // attributeロケーション取得
  a = gl.getAttribLocation(program, "position");

  // attribute有効化
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 0, 0);

  // 初期化時の色を黒に指定
  gl.clearColor(0, 0, 0, 1);

  // 動作開始時間を取得（時間の経過を調べるため）
  z = new Date().getTime();

  // 無名関数でメインルーチンを実行
  (function render() {
    // シェーダのリンクに失敗していたら実行しない
    if (!e) return;

    // ビューポートを動的に指定する
    const x = window.innerWidth;
    const y = window.innerHeight;
    $canvas.width = window.innerWidth;
    $canvas.height = window.innerHeight;
    gl.viewport(0, 0, x, y);

    // 時間の経過を調べる
    d = (new Date().getTime() - z) * 0.001;

    // フレームバッファをクリア
    gl.clear(gl.COLOR_BUFFER_BIT);

    // uniform変数をプッシュ
    gl.uniform1f(uniform.time, d);
    gl.uniform2fv(uniform.resolution, [x, y]);

    // プリミティブのレンダリング
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();

    // 再起
    requestAnimationFrame(render);
  })();

  // keydownに登録する関数
  function k(h) {
    e = (h.keyCode !== 27);
  }
})();
