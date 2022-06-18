var VSHADER_SOURCE = 
	'attribute vec4 a_Position;\n' +
	'attribute vec4 a_Color;\n' +
	'attribute vec4 a_Normal;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_ViewMatrix;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
	'uniform vec3 u_LightColor;\n' +
	'uniform vec3 u_LightPosition;\n' +
	'uniform vec3 u_AmbientLight;\n' +
	'varying vec4 v_Color;\n' +
	'void main(){\n' +
	'	gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
	// '	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	// '	v_Position = vec3(u_ModelMatrix * a_Position);\n' +
	// '	v_VertexToEye = vec3(u_ViewMatrix * u_ModelMatrix * a_Position);\n' +
	'	vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'	vec3 position = vec3(u_ModelMatrix * a_Position);\n' +
	'	vec3 vertexToEye = vec3(u_ViewMatrix * u_ModelMatrix * a_Position);\n' +
	'	vec3 lightDirection = normalize(u_LightPosition - position);\n' +
	
	'	vec3 reflectionVector = normalize(reflect(-lightDirection, normal));\n' +
	'	vec3 viewVectorEye = -normalize(vertexToEye);\n' +
	'	float specularDotL = max(dot(reflectionVector, viewVectorEye), 0.0);\n' +
	'	vec3 specular = u_LightColor * a_Color.rgb * specularDotL;\n' +
	'	float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
	'	vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
	'	vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
	
	'	v_Color = vec4(specular + diffuse + ambient, a_Color.a);\n' +
	'}\n';
	
var FSHADER_SOURCE = 
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'varying vec4 v_Color;\n' +
	'void main(){\n' +
	'	gl_FragColor = v_Color;\n' +
	'}\n';

	
var g_objDoc = []; // Информация о файлах OBJ
var g_drawingInfo; // Информация для отрисовки объекта
var g_counter = 0; // Счетчик для перебора имен файлов при onreadystatechange
	
window.onload = function main()
{
	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
		console.log('Failed to initialize shaders');
		return;
	}
	
	gl.clearColor(0.8, 0.8, 0.8, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
	var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
	var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
	var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	
	if(!u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight){
		console.log('Failed to get the storage location');
		return;
	}
	
	// Создание пустых буфферных объектов для передачи координат вершин, цветов, нормалей и индексов
	var model = initVertexBuffers(gl);
	if (!model) {
		console.log('Failed to set the vertex information');
		return;
	}
	
	// Передача в шейдер:
	gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);  // цвета света
	gl.uniform3f(u_LightPosition, 3.0, 2.0, 4.0); // координат положения точечного источника света
	gl.uniform3f(u_AmbientLight, 0.5, 0.5, 0.5); // цвета фонового освещения
	
	var modelMatrix = new Matrix4(); // Матрица модели
	var viewMatrix = new Matrix4(); // Матрица вида
	var projMatrix = new Matrix4(); // Матрица проекции
	var normalMatrix = new Matrix4(); // Матрица нормали
	
	// viewMatrix.lookAt(0, 6, 20, 0, 0, 0, 0, 1, 0);
	// gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	
	var proj = document.getElementById('proj');
	changeProjectionView(); // Расчет матрицы проекции вида
	
	// Чтение OBJ файлов
	fileNames = ['lightbluecube2.obj', 'lightbluecube.obj'];
	// fileNames = ['lightbluecube2.obj', 'sphere.obj'];
	readOBJFile(fileNames);
	
	
	var currentAngle = 0.0;
	var tick = function(){
		currentAngle = animate(currentAngle);
		draw();
		requestAnimationFrame(tick);
	};
	tick();
	
	function readOBJFile(fileNames){
		var request = []; // Подготовка массива запросов для каждого OBJ файла
		for(var i = 0; i < fileNames.length; i++){
			request.push( new XMLHttpRequest() ); // Создать объект запроса в массив
			request[i].open('GET', fileNames[i], true); // Подготовить запрос на получение файла
			request[i].send(); // Отправить запрос
			g_objDoc.push(null);
		}
		
		for(var i = 0; i < fileNames.length; i++){
			request[i].onreadystatechange = function() { // обработчик события изменения состояния готовности
				if (this.readyState === 4 && this.status !== 404) {
					// Добавить в массив OBJDoc объект с информацией о файле
					onReadOBJFile(this.responseText, fileNames[g_counter]);
				}
			}
		}
		
	}
	
	function onReadOBJFile(fileString, fileName) {
		g_objDoc[g_counter] = new OBJDoc(fileName);  // Создать OBJDoc объект
		g_objDoc[g_counter].parse(fileString, 1, true); // Парсить файл
		console.log(g_objDoc[g_counter]);
		g_counter++;
	}
	
	function draw()
	{	
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Очистка буфферов цвета и глубины
		
		if (g_objDoc[0] != null && g_objDoc[0].isMTLComplete()){ // Проверка завершения чтения и доступности информации о модели
			g_drawingInfo = onReadComplete(gl, model, g_objDoc[0]); // Передача координат вершин, цвета, нормалей и индексов в буферные объекты
		}
		if (!g_drawingInfo) return;   // Если модель еще не загрузилась
		
		// Для третьего куба
		modelMatrix.setTranslate(0.0, 0.0, 0.0).rotate(-currentAngle, 1, 1, 0).rotate(currentAngle, 0, 1, 1);
		gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
		
		normalMatrix.setInverseOf(modelMatrix);
		normalMatrix.transpose();
		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
		gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
	  
		if (g_objDoc[1] != null && g_objDoc[1].isMTLComplete()){
			g_drawingInfo = onReadComplete(gl, model, g_objDoc[1]);
		}
		if (!g_drawingInfo) return;

		//Для первого куба
		modelMatrix.setTranslate(0.0, 0.0, 0.0).rotate(currentAngle, 1, 1, 0); // Поворот фигуры с последующим перемещением
		gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
		
		normalMatrix.setInverseOf(modelMatrix).transpose(); // Установить матрицу нормалей как обратную от матрицы модели и транспонировать
		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
		// Отрисовка
		gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
		
		//Для второго куба
		modelMatrix.setTranslate(0.0, 0.0, 0.0).rotate(-currentAngle, 0, 1, 0).scale(1.5, 1.5, 1.5); //Масштабировать, повернуть, переместить фигуру
		gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
		
		normalMatrix.setInverseOf(modelMatrix);
		normalMatrix.transpose();
		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
		gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
	}
	
	function onReadComplete(gl, model, objDoc) {
		var drawingInfo = objDoc.getDrawingInfo();

		gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);
		  
		gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);

		return drawingInfo;
	}
	
	function changeProjectionView()
	{
		if(proj.value == 'p')
			projMatrix.setPerspective(35, canvas.width/canvas.height, 0.1, 100);
		else if(proj.value == 'o')
			projMatrix.setOrtho(-6.0 * canvas.width/canvas.height, 6.0 * canvas.width/canvas.height, -6.0, 6.0, 0.0, 100.0);
		gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
			
		viewMatrix.setLookAt(0, 6, 20, 0, 0, 0, 0, 1, 0);
		gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	}
	
	// Переключение проекции на веб-странице
	proj.onclick = function(){
		if(this.value == 'p'){
			this.value = 'o';
			this.innerHTML = 'Ortho';
			changeProjectionView();
		}
		else{
			this.value = 'p';
			this.innerHTML = 'Perspective';
			changeProjectionView();
		}
	}
	
	// Изменение размеров окна
	window.onresize = function (){
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		changeProjectionView();
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	
}

function initVertexBuffers(gl) {
  var o = new Object();
  o.vertexBuffer = gl.createBuffer();
  o.normalBuffer = gl.createBuffer();
  o.colorBuffer = gl.createBuffer();
  o.indexBuffer = gl.createBuffer();
  if (!o.vertexBuffer || !o.normalBuffer || !o.colorBuffer || !o.indexBuffer) { return null; }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return o;
}

var ANGLE_STEP = 20.0;
var g_last = Date.now();
function animate(angle)
{
	var now = Date.now();
	var elapsed = now - g_last;
	g_last = now;
	var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	return newAngle %= 360;
}


