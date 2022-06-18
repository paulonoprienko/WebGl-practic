var VSHADER_SOURCE = 
	'attribute vec4 a_Position;\n' +
	
	// 'attribute vec4 a_Color;\n' +
	'attribute vec2 a_TexCoord;\n' +
	
	'attribute vec4 a_Normal;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_ViewMatrix;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
	
	// 'varying vec4 v_Color;\n' +
	'varying vec2 v_TexCoord;\n' +
	
	'varying vec3 v_Normal;\n' +
	'varying vec3 v_Position;\n' +
	'varying vec3 v_VertexToEye;\n' +
	'void main(){\n' +
	'	gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
	'	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'	v_Position = vec3(u_ModelMatrix * a_Position);\n' +
	'	v_VertexToEye = vec3(u_ViewMatrix * u_ModelMatrix * a_Position);\n' +
	
	// '	v_Color = a_Color;\n' +
	'	v_TexCoord = a_TexCoord;\n' +
	
	'}\n';
	
var FSHADER_SOURCE = 
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'uniform vec3 u_LightColor;\n' +
	'uniform vec3 u_LightPosition;\n' +
	'uniform vec3 u_AmbientLight;\n' +
	'uniform vec3 u_DirLight;\n' +
	'uniform vec3 u_DirLightColor;\n' +
	
	'uniform sampler2D u_Sampler;\n' +
	// 'varying vec4 v_Color;\n' +
	'varying vec2 v_TexCoord;\n' +
	
	'varying vec3 v_Normal;\n' +
	'varying vec3 v_Position;\n' +
	'varying vec3 v_VertexToEye;\n' +
	'void main(){\n' +
	
	'	vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
	
	'	vec3 normal = normalize(v_Normal);\n' +
	
	// направление от позиционного источника к вершинам
	'	vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
	// направление от направленного источника
	'	vec3 dirLight = normalize(u_DirLight);\n' +
	
	
	'	vec3 viewVectorEye = -normalize(v_VertexToEye);\n' + // вектор от точки до камеры
	// зеркальное отражение от позиционного источника
	'	vec3 reflectionVector = normalize(reflect(-lightDirection, normal));\n' +
	'	float specularDotL = max(dot(reflectionVector, viewVectorEye), 0.0);\n' +
	'	float specularParam = pow(specularDotL, 50.0);\n' +
	// '	vec3 specular = u_LightColor * v_Color.rgb * specularParam;\n' +
	'	vec3 specular = u_LightColor * color.rgb * specularParam;\n' +
	
	// зеркальное отражение от направленного источника
	'	vec3 reflectionVector2 = normalize(reflect(-dirLight, normal));\n' +
	'	float specularDotL2 = max(dot(reflectionVector2, viewVectorEye), 0.0);\n' +
	'	float specularParam2 = pow(specularDotL2, 1.0);\n' +
	// '	vec3 specular2 = u_DirLightColor * v_Color.rgb * specularParam2;\n' +
	'	vec3 specular2 = u_DirLightColor * color.rgb * specularParam2;\n' +
	
	// диффузное отражение от позиционного источника
	'	float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
	// '	vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
	'	vec3 diffuse = u_LightColor * color.rgb * nDotL;\n' +
	
	// диффузное отражение от направленного источника
	'	float nDotL2 = max(dot(dirLight, normal), 0.0);\n' +
	// '	vec3 diffuse2 = u_DirLightColor * v_Color.rgb * nDotL2;\n' +
	'	vec3 diffuse2 = u_DirLightColor * color.rgb * nDotL2;\n' +
	
	// фоновое освещение
	// '	vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
	'	vec3 ambient = u_AmbientLight * color.rgb;\n' +
	
	// определение цвета
	// '	gl_FragColor = vec4(specular + diffuse + specular2 + diffuse2 + ambient, v_Color.a);\n' +
	'	gl_FragColor = vec4(specular + diffuse + specular2 + diffuse2 + ambient, color.a);\n' +
	'}\n';
	
// var VSHADER_SOURCE = 
	// 'attribute vec4 a_Position;\n' +
	// 'attribute vec4 a_Color;\n' +
	// 'attribute vec4 a_Normal;\n' +
	// 'uniform mat4 u_ModelMatrix;\n' +
	// 'uniform mat4 u_ViewMatrix;\n' +
	// 'uniform mat4 u_ProjMatrix;\n' +
	// 'uniform mat4 u_NormalMatrix;\n' +
	// 'varying vec4 v_Color;\n' +
	// 'varying vec3 v_Normal;\n' +
	// 'varying vec3 v_Position;\n' +
	// 'varying vec3 v_VertexToEye;\n' +
	// 'void main(){\n' +
	// '	gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
	// '	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	// '	v_Position = vec3(u_ModelMatrix * a_Position);\n' +
	// '	v_VertexToEye = vec3(u_ViewMatrix * u_ModelMatrix * a_Position);\n' +
	// '	v_Color = a_Color;\n' +
	// '}\n';
	
// var FSHADER_SOURCE = 
	// '#ifdef GL_ES\n' +
	// 'precision mediump float;\n' +
	// '#endif\n' +
	// 'uniform vec3 u_LightColor;\n' +
	// 'uniform vec3 u_LightPosition;\n' +
	// 'uniform vec3 u_AmbientLight;\n' +
	// 'uniform vec3 u_DirLight;\n' +
	// 'uniform vec3 u_DirLightColor;\n' +
	// 'varying vec4 v_Color;\n' +
	// 'varying vec3 v_Normal;\n' +
	// 'varying vec3 v_Position;\n' +
	// 'varying vec3 v_VertexToEye;\n' +
	// 'void main(){\n' +
	// '	vec3 normal = normalize(v_Normal);\n' +
	
	// // направление от позиционного источника к вершинам
	// '	vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
	// // направление от направленного источника
	// '	vec3 dirLight = normalize(u_DirLight);\n' +
	
	
	// '	vec3 viewVectorEye = -normalize(v_VertexToEye);\n' + // вектор от точки до камеры
	// // зеркальное отражение от позиционного источника
	// '	vec3 reflectionVector = normalize(reflect(-lightDirection, normal));\n' +
	// '	float specularDotL = max(dot(reflectionVector, viewVectorEye), 0.0);\n' +
	// '	float specularParam = pow(specularDotL, 50.0);\n' +
	// '	vec3 specular = u_LightColor * v_Color.rgb * specularParam;\n' +
	
	// // зеркальное отражение от направленного источника
	// '	vec3 reflectionVector2 = normalize(reflect(-dirLight, normal));\n' +
	// '	float specularDotL2 = max(dot(reflectionVector2, viewVectorEye), 0.0);\n' +
	// '	float specularParam2 = pow(specularDotL2, 1.0);\n' +
	// '	vec3 specular2 = u_DirLightColor * v_Color.rgb * specularParam2;\n' +
	
	// // диффузное отражение от позиционного источника
	// '	float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
	// '	vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
	
	// // диффузное отражение от направленного источника
	// '	float nDotL2 = max(dot(dirLight, normal), 0.0);\n' +
	// '	vec3 diffuse2 = u_DirLightColor * v_Color.rgb * nDotL2;\n' +
	
	// // фоновое освещение
	// '	vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
	
	// // определение цвета
	// '	gl_FragColor = vec4(specular + diffuse + specular2 + diffuse2 + ambient, v_Color.a);\n' +
	// '}\n';

	
var g_objDoc = null; // Информация о файлах OBJ
var g_drawingInfo = null; // Информация для отрисовки объекта
	
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
	
	// var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
	var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
	var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
	var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	var u_DirLight = gl.getUniformLocation(gl.program, 'u_DirLight');
	var u_DirLightColor = gl.getUniformLocation(gl.program, 'u_DirLightColor');
	
	// Создание пустых буфферных объектов для передачи координат вершин, цветов, нормалей и индексов
	var model = initVertexBuffers(gl);
	if (!model) {
		console.log('Failed to set the vertex information');
		return;
	}
	
	gl.uniform3f(u_LightColor, 0.5, 0.5, 0.5);  // цвет позиционого источника света
	gl.uniform3f(u_LightPosition, 3.0, 2.0, 4.0); // координаты положения позиционого источника света
	
	gl.uniform3f(u_AmbientLight, 0.5, 0.5, 0.5); // цвет фонового освещения
	
	gl.uniform3f(u_DirLight, -3.0, 5.0, 4.0);  // вектор направленного источника света
	gl.uniform3f(u_DirLightColor, 0.5, 0.5, 0.5); // цвет направленного источника света
	
	var modelMatrix = new Matrix4(); // Матрица модели
	var viewMatrix = new Matrix4(); // Матрица вида
	var projMatrix = new Matrix4(); // Матрица проекции
	var normalMatrix = new Matrix4(); // Матрица нормали
	
	var proj = document.getElementById('proj');
	changeProjectionView(); // Расчет матрицы проекции вида
	
	// Чтение OBJ файлов
	readOBJFile('multi_objs2.obj');
	// readOBJFile('sphere.obj');
	
	
	var currentAngle = 0.0;
	var tick = function(){
		currentAngle = animate(currentAngle);
		draw();
		requestAnimationFrame(tick);
	};
	tick();
	
	function readOBJFile(fileName){
		
		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status !== 404) {
				onReadOBJFile(request.responseText, fileName);
			}
		}
		request.open('GET', fileName, true); // Create a request to acquire the file
		request.send();                      // Send the request
	}
	
	function initVertexBuffers() {
		var o = new Object();
		o.vertexBuffer = createEmptyArrayBuffer(a_Position, 3, gl.FLOAT);
		o.normalBuffer = createEmptyArrayBuffer(a_Normal, 3, gl.FLOAT);
		
		// o.colorBuffer = createEmptyArrayBuffer(a_Color, 4, gl.FLOAT);
		o.texCoordBuffer = createEmptyArrayBuffer(a_TexCoord, 2, gl.FLOAT);
		
		o.indexBuffer = gl.createBuffer();
		// if (!o.vertexBuffer || !o.normalBuffer || !o.colorBuffer || !o.indexBuffer) { return null; }

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		
		
		
		
		
	
		return o;
	}

	function createEmptyArrayBuffer(a_attribute, num, type) {
		var buffer =  gl.createBuffer();  // Create a buffer object
		if (!buffer) {
		console.log('Failed to create the buffer object');
		return null;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);  // Assign the buffer object to the attribute variable
		gl.enableVertexAttribArray(a_attribute);  // Enable the assignment

		return buffer;
	}
	
	function onReadOBJFile(fileString, fileName) {		
		var objDoc = new OBJDoc(fileName);  // Create a OBJDoc object
		var result = objDoc.parse(fileString, 1, true); // Parse the file
		if (!result) {
			g_objDoc = null; g_drawingInfo = null;
			console.log("OBJ file parsing error.");
			return;
		}
			g_objDoc = objDoc;
			console.log(g_objDoc);
	}
	var texture = gl.createTexture();
		var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
		
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			document.getElementById('cb-image')
		);
		gl.uniform1i(u_Sampler, 0);
	function draw()
	{	
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Очистка буфферов цвета и глубины
		
		if (g_objDoc != null && g_objDoc.isMTLComplete()){ // Проверка завершения чтения и доступности информации о модели
			g_drawingInfo = onReadComplete(gl, model, g_objDoc); // Передача координат вершин, цвета, нормалей и индексов в буферные объекты
			g_objDoc = null;
		}
		if (!g_drawingInfo) return;   // Если модель еще не загрузилась
		
	  
		// Для третьего куба
		
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			document.getElementById('cb-image2')
		);
		gl.uniform1i(u_Sampler, 0);
		
		modelMatrix.setTranslate(0.0, 0.0, 0.0).rotate(-currentAngle, 1, 1, 0).rotate(-currentAngle, 0, 1, 1);
		gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
		
		normalMatrix.setInverseOf(modelMatrix).transpose();
		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
		
		setToBuffer(gl, model, 2);
		gl.drawElements(gl.TRIANGLES, g_drawingInfo[2].indices.length, gl.UNSIGNED_SHORT, 0);

		//Для первого куба
		
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			document.getElementById('cb-image')
		);
		gl.uniform1i(u_Sampler, 0);
		
		modelMatrix.setTranslate(0.0, 0.0, 0.0).rotate(currentAngle, 0, 1, 0); // Поворот фигуры с последующим перемещением
		gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
		
		normalMatrix.setInverseOf(modelMatrix).transpose(); // Установить матрицу нормалей как обратную от матрицы модели и транспонировать
		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
		// Отрисовка
		setToBuffer(gl, model, 1);
		gl.drawElements(gl.TRIANGLES, g_drawingInfo[1].indices.length, gl.UNSIGNED_SHORT, 0);
		
		//Для второго куба
		
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			document.getElementById('cb-image2')
		);
		gl.uniform1i(u_Sampler, 0);
		
		modelMatrix.setTranslate(0.0, 0.0, 0.0).rotate(currentAngle, 1, 1, 0); //Масштабировать, повернуть, переместить фигуру
		gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
		
		normalMatrix.setInverseOf(modelMatrix).transpose();
		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
		
		setToBuffer(gl, model, 0);
		gl.drawElements(gl.TRIANGLES, g_drawingInfo[0].indices.length, gl.UNSIGNED_SHORT, 0);
	}
	
	function onReadComplete(gl, model, objDoc) {
		var drawingInfo = objDoc.getDrawingInfo();
		return drawingInfo;		
	}
	
	function setToBuffer(gl, model, i) {
		// Write date into the buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo[i].vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo[i].normals, gl.STATIC_DRAW);
		  
		// gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
		// gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo[i].colors, gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo[i].textureCoords, gl.STATIC_DRAW);
		  
		// Write the indices to the buffer object
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g_drawingInfo[i].indices, gl.STATIC_DRAW);
		
		
		
		
		
	
	
	
	
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
	
	positional.oninput = function(){
		val = this.value;
		gl.uniform3f(u_LightColor, val, val, val);
	}
	directional.oninput = function(){
		val = this.value;
		gl.uniform3f(u_DirLightColor, val, val, val);
	}
	ambient.oninput = function(){
		val = this.value;
		gl.uniform3f(u_AmbientLight, val, val, val);
	}
	
	// Изменение размеров окна
	window.onresize = function (){
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		changeProjectionView();
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	
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


