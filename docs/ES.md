# ¡Bienvenido a Polkadot Cloud Staking!

Esta sección tiene como objetivo familiarizar a los desarrolladores con el Polkadot Staking Dashboard. Ponte en contacto con __staking@polkadot.cloud__ para aclarar cualquier contenido de este documento.

## Envío de Pull Requests

Este proyecto sigue la especificación de Conventional Commits. Los pull requests se fusionan y comprimen, utilizando el título del pull request como mensaje de commit. Los mensajes de commit deben adherirse a la siguiente estructura:

```
<tipo>(<ámbito>): <resumen>
```

Ejemplos de títulos de PR:

- feat: implementar superposición de ayuda
- feat(auth): implementar API de inicio de sesión
- fix: resolver problema con la alineación de botones
- fix(docs): corregir sección de instalación en el README

El tipo **chore** no se añadirá a los registros de cambios de versiones y debe utilizarse para actualizaciones silenciosas.

Si deseas saber más sobre la especificación de Conventional Commits, visita el [sitio web de Conventional Commits](https://www.conventionalcommits.org/).

## Lanzamientos

[Release Please](https://github.com/googleapis/release-please) se utiliza para automatizar la generación de registros de cambios y lanzamientos de cada paquete.

Release Please es una acción de GitHub mantenida por Google que automatiza la generación de CHANGELOG, la creación de lanzamientos de GitHub y los cambios de versión.[[Documentación de GitHub](https://github.com/googleapis/release-please), [Acción](https://github.com/marketplace/actions/release-please-action)]

## Variables de URL

Las variables de URL se pueden utilizar para dirigir a los usuarios a configuraciones específicas de la aplicación. Las variables de URL tienen prioridad sobre los valores guardados en el almacenamiento local y sobrescribirán las configuraciones actuales.

Las variables de URL actualmente compatibles son las siguientes:

- **n**: Red predeterminada a la que conectarse al visitar la aplicación
- **l**: Idioma a utilizar al visitar la aplicación
- **a**: Cuenta a la que conectarse al visitar la aplicación (se ignora si la cuenta no está presente en las cuentas importadas del usuario)

Como ejemplo, la siguiente URL cargará Kusama y utilizará la localización en chino:

**staking.polkadot.cloud/#/overview?n=kusama&l=zh**

## Añadir Operadores de Validadores

Para añadir un operador de validador, envía un PR a [@w3ux/w3ux-library](https://github.com/w3ux/w3ux-library/tree/main). El operador estará entonces disponible en el paquete NPM **@w3ux/validator-assets**.
[Instrucciones completas](https://github.com/w3ux/w3ux-library/tree/main/library/validator-assets).

## Presentaciones

- 29/06/2023: [[Video] Polkadot Decoded 2023: The Next Step of the Polkadot UX Journey](https://www.youtube.com/watch?v=s78SZZ_ZA64)
- 30/06/2022: [[Video] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)

## Historial de Transferencia del Repositorio

**17/06/2024:** Trasladado desde **paritytech/polkadot-staking-dashboard**
