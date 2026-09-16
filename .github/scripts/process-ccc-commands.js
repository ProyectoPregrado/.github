const comment = context.payload.comment.body;
const issue = context.payload.issue;
const norm = (s) =>
    (s ?? '')
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()
        .toLowerCase();

const hasUser = (issue.labels || []).some(l => norm(l.name) === 'user');
if (!hasUser) {
    console.log('No es un issue de usuario, saltando.');
    return;
}

// ← AHORA SÍ tendrán valores gracias al bloque env: de arriba
const USER_LOGIN = process.env.USER_LOGIN;
const PN_USER = parseInt(process.env.PROJECT_NUMBER_USER || '0', 10);

// DEBUG: Verificar que las variables están llegando
console.log(`DEBUG: USER_LOGIN=${USER_LOGIN}, PN_USER=${PN_USER}`);

if (!USER_LOGIN || PN_USER === 0) {
    console.log('❌ ERROR: Variables de entorno no configuradas correctamente');
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        body: `## ❌ Error de Configuración

              Las variables de entorno no están configuradas correctamente en el workflow.

              **Debug info:**
              - USER_LOGIN: \`${USER_LOGIN || 'NO DEFINIDO'}\`
              - PROJECT_NUMBER_USER: \`${PN_USER}\`

              Por favor, contacta al administrador del repositorio.`
    });
    return;
}

const userProjUrl = `https://github.com/users/${USER_LOGIN}/projects/${PN_USER}`;

const cmd = comment.toLowerCase().trim();
if (!cmd.startsWith('/verificar') && !cmd.startsWith('/actualizar') && !cmd.startsWith('/ayuda')) {
    return;
}

async function getUserProjByNum(n) {
    console.log(`Buscando proyecto #${n} del usuario ${USER_LOGIN}...`);
    const r = await github.graphql(
        `query($login:String!){
                                user(login:$login){
                                  projectsV2(first:50){
                                    nodes{ id number title }
                                  }
                                }
                              }`,
        { login: USER_LOGIN }
    ).catch((e) => {
        console.log(`Error GraphQL: ${e.message}`);
        return null;
    });

    const nodes = r?.user?.projectsV2?.nodes || [];
    console.log(`Proyectos encontrados: ${nodes.length}`);
    nodes.forEach(p => console.log(`  - #${p.number}: ${p.title}`));

    const found = nodes.find(x => x.number === n);
    if (found) {
        console.log(`✅ Proyecto encontrado: ${found.id}`);
    } else {
        console.log(`❌ Proyecto #${n} no encontrado`);
    }
    return found?.id || null;
}

async function findItemId(projectId, issueNumber) {
    const r = await github.graphql(
        `query($projectId:ID!, $q:String!){
                  node(id:$projectId){
                    ... on ProjectV2 {
                      items(first:50, query:$q){
                        nodes{
                          id
                          content{ ... on Issue { number } }
                        }
                      }
                    }
                  }
                }`,
        { projectId, q: String(issueNumber) }
    );
    return r?.node?.items?.nodes?.find(n => n.content?.number === issueNumber)?.id || null;
}

async function getFields(projectId) {
    const r = await github.graphql(
        `query($projectId:ID!){
                  node(id:$projectId){
                    ... on ProjectV2 {
                      fields(first:100){
                        nodes{
                          ... on ProjectV2FieldCommon { id name dataType }
                          ... on ProjectV2SingleSelectField { id name options { id name } }
                        }
                      }
                    }
                  }
                }`,
        { projectId }
    );
    return r?.node?.fields?.nodes || [];
}

async function getFieldValues(itemId) {
    const r = await github.graphql(
        `query($itemId:ID!){
                  node(id:$itemId){
                    ... on ProjectV2Item {
                      fieldValues(first:100){
                        nodes{
                          ... on ProjectV2ItemFieldTextValue {
                            text
                            field { ... on ProjectV2FieldCommon { id name } }
                          }
                          ... on ProjectV2ItemFieldDateValue {
                            date
                            field { ... on ProjectV2FieldCommon { id name } }
                          }
                          ... on ProjectV2ItemFieldSingleSelectValue {
                            name
                            optionId
                            field { ... on ProjectV2FieldCommon { id name } }
                          }
                        }
                      }
                    }
                  }
                }`,
        { itemId }
    );
    return r?.node?.fieldValues?.nodes || [];
}

const projectId = await getUserProjByNum(PN_USER);
if (!projectId) {
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        body: `## ❌ No se pudo encontrar el proyecto de usuarios

            **Detalles de diagnóstico:**
            - Usuario: \`${USER_LOGIN}\`
            - Número de proyecto buscado: \`${PN_USER}\`
            - URL esperada: ${userProjUrl}

            **Posibles soluciones:**
            1. Verifica que el proyecto #${PN_USER} exista en https://github.com/${USER_LOGIN}?tab=projects
            2. Asegúrate de que el PAT tenga permisos para acceder a proyectos (scope: \`project\`)
            3. Verifica que las variables \`USER_LOGIN\` y \`PROJECT_NUMBER_USER\` estén correctas en el workflow`
    });
    return;
}

const itemId = await findItemId(projectId, issue.number);
if (!itemId) {
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        body: '❌ No se pudo encontrar este issue en el proyecto. Asegúrate de que el issue haya sido agregado al proyecto.'
    });
    return;
}

// ═══════════════════════════════════════════════════════════════════
// Comando: /ayuda
// ═══════════════════════════════════════════════════════════════════
if (cmd.startsWith('/ayuda')) {
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        body: `## 📚 Ayuda - Formulario CCC

            ### Descripción de campos requeridos:

            **Change Type (Tipo de cambio)**
            - Escribe una de las opciones: \`estandar\`, \`normal\`, o \`emergencia\`.

            **Impact (Impacto)**
            - Describe qué sistemas, usuarios o procesos se verán afectados
            - Indica el nivel de criticidad (Bajo/Medio/Alto)
            - Ejemplo: "Afecta a 500 usuarios del módulo de facturación. Criticidad: Alta"

            **Implementation Plan (Plan de implementación)**
            - Lista los pasos específicos para implementar el cambio
            - Incluye recursos necesarios (personas, herramientas)
            - Especifica duración estimada y ventana de mantenimiento
            - Ejemplo:
              1. Backup de base de datos (30 min)
              2. Deploy de nueva versión (15 min)
              3. Migración de datos (1 hora)

            **RollBack Planning (Plan de reversa)**
            - Describe cómo revertir el cambio si algo sale mal
            - Incluye comandos o scripts específicos
            - Indica tiempo estimado de recuperación
            - Especifica si es completamente reversible

            **Test Planning (Plan de pruebas)**
            - Detalla la estrategia de testing
            - Lista casos de prueba críticos
            - Incluye tests unitarios, integración y E2E
            - Define criterios de éxito

            **Approvers (Aprobadores)**
            - Menciona (@usuario) a todas las personas que deben aprobar
            - Típicamente: Tech Lead, Product Owner, DevOps
            - Ejemplo: @tech-lead @product-owner @devops-team

            **Start date (Fecha de inicio)**
            - Fecha en formato YYYY-MM-DD
            - Ejemplo: 2025-11-15

            **Target date (Fecha objetivo)**
            - Fecha límite en formato YYYY-MM-DD
            - Ejemplo: 2025-11-30

            ### Comandos disponibles:
            - \`/verificar\` - Verifica si completaste los campos en el proyecto
            - \`/actualizar\` - Actualiza el proyecto con info de este issue
            - \`/ayuda\` - Muestra esta ayuda

            **[Ir al proyecto →](${userProjUrl})**`
    });
    return;
}

// ═══════════════════════════════════════════════════════════════════
// Comando: /verificar
// ═══════════════════════════════════════════════════════════════════
if (cmd.startsWith('/verificar')) {
    const fields = await getFields(projectId);
    const by = (names) =>
        names.map(n => fields.find(f => norm(f?.name) === norm(n))).find(Boolean);

    const fChangeType = by(['Change Type', 'Tipo de cambio']);
    const fImpact = by(['Impact']);
    const fPlan = by(['Implementation Plan']);
    const fRollback = by(['RollBack Planning', 'Rollback Plan']);
    const fPruebas = by(['Test Planning']);
    const fAprob = by(['Approvers']);
    const fStart = by(['Start date']);
    const fTarget = by(['Target date']);

    const values = await getFieldValues(itemId);
    function getValue(field) {
        if (!field) return null;
        const v = values.find(n => norm(n.field?.name) === norm(field.name));
        if (!v) return null;
        if ('text' in v) return (v.text || '').trim();
        if ('date' in v) return (v.date || '').trim();
        if ('name' in v) return (v.name || '').trim();
        return null;
    }

    const missing = [];
    const complete = [];

    const checkField = (field, name) => {
        const val = getValue(field);
        if (!val) {
            missing.push(name);
        } else {
            complete.push(`${name}: ✅`);
        }
    };

    checkField(fChangeType, 'Change Type');
    checkField(fImpact, 'Impact');
    checkField(fPlan, 'Implementation Plan');
    checkField(fRollback, 'RollBack Planning');
    checkField(fPruebas, 'Test Planning');
    checkField(fAprob, 'Approvers');
    checkField(fStart, 'Start date');
    checkField(fTarget, 'Target date');

    if (missing.length === 0) {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
            body: `## ✅ Verificación Completa

            ¡Excelente! Todos los campos requeridos están completos:

            ${complete.map(c => `- ${c}`).join('\n')}

            Ahora puedes agregar la etiqueta \`approved\` para completar la aprobación.`
        });

        await github.rest.issues.addLabels({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
            labels: ['approved']
        });
    } else {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
            body: `## ⚠️ Campos Faltantes

            Aún faltan los siguientes campos en el proyecto:

            ${missing.map(m => `- [ ] \`${m}\``).join('\n')}

            **[Ir al proyecto para completarlos →](${userProjUrl})**

            Los siguientes campos ya están completos:
            ${complete.map(c => `- ${c}`).join('\n')}

            Una vez completados, ejecuta \`/verificar\` nuevamente.`
        });
    }
    return;
}

// ═══════════════════════════════════════════════════════════════════
// Comando: /actualizar
// ═══════════════════════════════════════════════════════════════════
if (cmd.startsWith('/actualizar')) {
    const issueBody = issue.body || '';
    const updated = [];
    const failed = [];

    function escRE(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

    function grab(label) {
        const L = escRE(label);
        const patterns = [
            new RegExp(`^###\\s*${L}\\s*\\n+([\\s\\S]*?)(?=\\n###|\\n$|$)`, 'im'),
            new RegExp(`\`\`\`[\\s\\S]*?###\\s*${L}\\s*\\n+([\\s\\S]*?)(?=\\n###|\\n\`\`\`|$)`, 'i'),
            new RegExp(`\\*\\*${L}\\s*(\\([^)]*\\))?\\*\\*[\\s\\r\\n]+([\\s\\S]*?)(?=\\n\\*\\*|\\n###|\\n\\nComandos|\\n$|$)`, 'i'),
            new RegExp(`(?:\\*\\*${L}\\s*\\(.*?\\)\\*\\*|###\\s*${L})[\\s\\S]*?:\\[?.*?\\]?\\s*(\\w+)`, 'i')
        ];

        for (const re of patterns) {
            let m = comment.match(re);
            if (!m) m = issueBody.match(re);
            if (m) {
                return (m[2] || m[1] || '').trim();
            }
        }
        return '';
    }

    function normalizeDate(dateStr) {
        if (!dateStr) return null;
        const match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (!match) return null;
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const day = match[3].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const fields = await getFields(projectId);
    const by = (names) =>
        names.map(n => fields.find(f => norm(f?.name) === norm(n))).find(Boolean);

    const fChangeType = by(['Change Type', 'Tipo de cambio']);
    const fImpact = by(['Impact']);
    const fPlan = by(['Implementation Plan']);
    const fRollback = by(['RollBack Planning', 'Rollback Plan']);
    const fPruebas = by(['Test Planning']);
    const fAprob = by(['Approvers']);
    const fStart = by(['Start date']);
    const fTarget = by(['Target date']);

    const setText = async (fieldName, field, value) => {
        if (!field || !value) return;
        try {
            await github.graphql(
                `mutation($projectId:ID!, $itemId:ID!, $fieldId:ID!, $val:String!){
                      updateProjectV2ItemFieldValue(input:{
                        projectId:$projectId,
                        itemId:$itemId,
                        fieldId:$fieldId,
                        value:{ text:$val }
                      }){
                        clientMutationId
                      }
                    }`,
                { projectId, itemId, fieldId: field.id, val: value }
            );
            updated.push(fieldName);
        } catch (e) {
            console.log(`Error al actualizar ${fieldName}: ${e.message}`);
            failed.push(fieldName);
        }
    };

    const setDate = async (fieldName, field, ymd) => {
        if (!field || !ymd) return;
        try {
            await github.graphql(
                `mutation($projectId:ID!, $itemId:ID!, $fieldId:ID!, $val:Date!){
                      updateProjectV2ItemFieldValue(input:{
                        projectId:$projectId,
                        itemId:$itemId,
                        fieldId:$fieldId,
                        value:{ date:$val }
                      }){
                        clientMutationId
                      }
                    }`,
                { projectId, itemId, fieldId: field.id, val: ymd }
            );
            updated.push(fieldName);
        } catch (e) {
            console.log(`Error al actualizar ${fieldName}: ${e.message}`);
            failed.push(fieldName);
        }
    };

    async function setSelect(fieldName, field, optName) {
        if (!field || !optName) return;

        const normalizedOptName = norm(optName.replace(/[\*\[\]x\(\)]/g, ''));

        const opts = field.options || [];
        const wanted = opts.find(o => norm(o.name) === normalizedOptName) || opts.find(o => norm(o.name).includes(normalizedOptName));

        if (!wanted) {
            console.log(`Opción "${normalizedOptName}" no encontrada para el campo "${field.name}"`);
            failed.push(fieldName);
            return;
        }

        try {
            await github.graphql(
                `mutation($projectId:ID!, $itemId:ID!, $fieldId:ID!, $opt:String!){
                      updateProjectV2ItemFieldValue(input:{
                        projectId:$projectId,
                        itemId:$itemId,
                        fieldId:$fieldId,
                        value:{ singleSelectOptionId:$opt }
                      }){
                        clientMutationId
                      }
                    }`,
                { projectId, itemId, fieldId: field.id, opt: wanted.id }
            );
            updated.push(fieldName);
        } catch (e) {
            console.log(`Error al actualizar ${fieldName}: ${e.message}`);
            failed.push(fieldName);
        }
    }

    const changeType = grab('Change Type') || grab('Tipo de cambio');
    const impact = grab('Impact');
    const plan = grab('Implementation Plan');
    const rollback = grab('RollBack Planning');
    const testing = grab('Test Planning');
    const approvers = grab('Approvers');
    const startDate = normalizeDate(grab('Start date') || grab('Fecha de inicio'));
    const targetDate = normalizeDate(grab('Target date') || grab('Fecha objetivo'));

    await setSelect('Change Type', fChangeType, changeType);
    await setText('Impact', fImpact, impact);
    await setText('Implementation Plan', fPlan, plan);
    await setText('RollBack Planning', fRollback, rollback);
    await setText('Test Planning', fPruebas, testing);
    await setText('Approvers', fAprob, approvers);
    await setDate('Start date', fStart, startDate);
    await setDate('Target date', fTarget, targetDate);

    let body = '';
    if (updated.length > 0) {
        body += `## ✅ Proyecto Actualizado

            Se actualizaron los siguientes campos en el proyecto desde tu comentario:

            ${updated.map(u => `- ✅ ${u}`).join('\n')}

            `;
    }

    if (failed.length > 0) {
        body += `## ⚠️ Campos Fallidos

            No se pudieron actualizar los siguientes campos:

            ${failed.map(f => `- ❌ ${f}`).join('\n')}

            Por favor, verifica que las opciones del proyecto (como 'Change Type') coincidan con lo que escribiste, o llena estos campos manualmente en el proyecto.

            `;
    }

    if (updated.length === 0 && failed.length === 0) {
        body = `## ⚠️ No se encontró información para actualizar

            Asegúrate de haber completado la plantilla en un comentario anterior con el formato correcto.

            **Pega la plantilla de \`/ayuda\` y llénala** en un nuevo comentario, luego ejecuta \`/actualizar\` otra vez.`;
    } else {
        body += `**[Ver en el proyecto →](${userProjUrl})**

            Ejecuta \`/verificar\` para confirmar que todo esté completo y proceder con la aprobación.`;
    }

    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        body: body
    });
}