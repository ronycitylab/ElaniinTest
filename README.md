# ElaniinTest
# Para la realización de la prueba hago uso de este repositorio de Github
#
# Hago uso de la CustomFont "Monserrat a lo largoo de la app".
# Opté por el inicio de sesión de usuario con Gmail a tráves de Firebase.
# El proyecto se compone de 4 pantallas, el Stack de navegación se maneja desde App.js
# Pantallas: Login, Home, Teams, Detail
#
# En login el usuario debe autenticarse ó de lo contrario no le permitira el ingreso al app.
# Luego el usuario debe escoger una cuenta de gmail para su registro ó inicio de sesión, al registrarse la BDD realtime 
# registrará el inicio de sesión, en caso de que ya se haya registrado antes, la BDD hará un update al campo last_logged_in,
# Dentro de Home, el usuario puede escoger entre 3 opciones, Ver la lista de equipos a los que pertenece, ingresar un nuevo 
# equipo, ó ingresar el código de un equipo existente para formar parte de este equipo.
# 
# Al crear un equipo se solicitará la región, posteriormente seleccionada la región la app cargará los pokémones disponibles 
# puede demorar unos segundos si son muchos, y el usuario, 
# podrá seleccionar un minimo de 3 ó un máximo de 6 para formar su equipo, con lo cúal al completar esta información
# más el nombre del equipo, el usuario podrá tener en su lista de equipos el recién creado.
# 
# Por último el usuario podrá visualizar la lista de equipos a las ue pertenece y acceder a estos, dónde encontrará la 
# información del equipo, nombre, descripción pokédex, pokémones del equipo y código(token) para compartir 
# ó ingresar desde otra cuenta ó dispositivo
#
# al final de la screen Detail aparece un botón que permite eliminar un equipo 