import '/node_modules/vite/dist/client/env.mjs';

const template = /*html*/ `
<style>
:host {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
  --monospace: 'SFMono-Regular', Consolas,
              'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  width: 800px;
  color: #d8d8d8;
  margin: 30px auto;
  padding: 25px 40px;
  position: relative;
  background: #181818;
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
<div class="window">
  <pre class="message"><span class="plugin"></span><span class="message-body"></span></pre>
  <pre class="file"></pre>
  <pre class="frame"></pre>
  <pre class="stack"></pre>
  <div class="tip">
    Click outside or fix the code to dismiss.<br>
    You can also disable this overlay by setting
    <code>server.hmr.overlay</code> to <code>false</code> in <code>vite.config.js.</code>
  </div>
</div>
`;
const fileRE = /(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g;
const codeframeRE = /^(?:>?\s+\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm;
// Allow `ErrorOverlay` to extend `HTMLElement` even in environments where
// `HTMLElement` was not originally defined.
const { HTMLElement = class {
} } = globalThis;
class ErrorOverlay extends HTMLElement {
    constructor(err) {
        var _a;
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = template;
        codeframeRE.lastIndex = 0;
        const hasFrame = err.frame && codeframeRE.test(err.frame);
        const message = hasFrame
            ? err.message.replace(codeframeRE, '')
            : err.message;
        if (err.plugin) {
            this.text('.plugin', `[plugin:${err.plugin}] `);
        }
        this.text('.message-body', message.trim());
        const [file] = (((_a = err.loc) === null || _a === void 0 ? void 0 : _a.file) || err.id || 'unknown file').split(`?`);
        if (err.loc) {
            this.text('.file', `${file}:${err.loc.line}:${err.loc.column}`, true);
        }
        else if (err.id) {
            this.text('.file', file);
        }
        if (hasFrame) {
            this.text('.frame', err.frame.trim());
        }
        this.text('.stack', err.stack, true);
        this.root.querySelector('.window').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        this.addEventListener('click', () => {
            this.close();
        });
    }
    text(selector, text, linkFiles = false) {
        const el = this.root.querySelector(selector);
        if (!linkFiles) {
            el.textContent = text;
        }
        else {
            let curIndex = 0;
            let match;
            while ((match = fileRE.exec(text))) {
                const { 0: file, index } = match;
                if (index != null) {
                    const frag = text.slice(curIndex, index);
                    el.appendChild(document.createTextNode(frag));
                    const link = document.createElement('a');
                    link.textContent = file;
                    link.className = 'file-link';
                    link.onclick = () => {
                        fetch('/__open-in-editor?file=' + encodeURIComponent(file));
                    };
                    el.appendChild(link);
                    curIndex += frag.length + file.length;
                }
            }
        }
    }
    close() {
        var _a;
        (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this);
    }
}
const overlayId = 'vite-error-overlay';
const { customElements } = globalThis; // Ensure `customElements` is defined before the next line.
if (customElements && !customElements.get(overlayId)) {
    customElements.define(overlayId, ErrorOverlay);
}

console.debug('[vite] connecting...');
const importMetaUrl = new URL(import.meta.url);
// use server configuration, then fallback to inference
const serverHost = "localhost:5173/";
const socketProtocol = null || (location.protocol === 'https:' ? 'wss' : 'ws');
const hmrPort = null;
const socketHost = `${null || importMetaUrl.hostname}:${hmrPort || importMetaUrl.port}${"/"}`;
const directSocketHost = "localhost:5173/";
const base = "/" || '/';
const messageBuffer = [];
let socket;
try {
    let fallback;
    // only use fallback when port is inferred to prevent confusion
    if (!hmrPort) {
        fallback = () => {
            // fallback to connecting directly to the hmr server
            // for servers which does not support proxying websocket
            socket = setupWebSocket(socketProtocol, directSocketHost, () => {
                const currentScriptHostURL = new URL(import.meta.url);
                const currentScriptHost = currentScriptHostURL.host +
                    currentScriptHostURL.pathname.replace(/@vite\/client$/, '');
                console.error('[vite] failed to connect to websocket.\n' +
                    'your current setup:\n' +
                    `  (browser) ${currentScriptHost} <--[HTTP]--> ${serverHost} (server)\n` +
                    `  (browser) ${socketHost} <--[WebSocket (failing)]--> ${directSocketHost} (server)\n` +
                    'Check out your Vite / network configuration and https://vitejs.dev/config/server-options.html#server-hmr .');
            });
            socket.addEventListener('open', () => {
                console.info('[vite] Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.');
            }, { once: true });
        };
    }
    socket = setupWebSocket(socketProtocol, socketHost, fallback);
}
catch (error) {
    console.error(`[vite] failed to connect to websocket (${error}). `);
}
function setupWebSocket(protocol, hostAndPath, onCloseWithoutOpen) {
    const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr');
    let isOpened = false;
    socket.addEventListener('open', () => {
        isOpened = true;
    }, { once: true });
    // Listen for messages
    socket.addEventListener('message', async ({ data }) => {
        handleMessage(JSON.parse(data));
    });
    // ping server
    socket.addEventListener('close', async ({ wasClean }) => {
        if (wasClean)
            return;
        if (!isOpened && onCloseWithoutOpen) {
            onCloseWithoutOpen();
            return;
        }
        console.log(`[vite] server connection lost. polling for restart...`);
        await waitForSuccessfulPing(hostAndPath);
        location.reload();
    });
    return socket;
}
function warnFailedFetch(err, path) {
    if (!err.message.match('fetch')) {
        console.error(err);
    }
    console.error(`[hmr] Failed to reload ${path}. ` +
        `This could be due to syntax errors or importing non-existent ` +
        `modules. (see errors above)`);
}
function cleanUrl(pathname) {
    const url = new URL(pathname, location.toString());
    url.searchParams.delete('direct');
    return url.pathname + url.search;
}
let isFirstUpdate = true;
async function handleMessage(payload) {
    switch (payload.type) {
        case 'connected':
            console.debug(`[vite] connected.`);
            sendMessageBuffer();
            // proxy(nginx, docker) hmr ws maybe caused timeout,
            // so send ping package let ws keep alive.
            setInterval(() => {
                if (socket.readyState === socket.OPEN) {
                    socket.send('{"type":"ping"}');
                }
            }, 30000);
            break;
        case 'update':
            notifyListeners('vite:beforeUpdate', payload);
            // if this is the first update and there's already an error overlay, it
            // means the page opened with existing server compile error and the whole
            // module script failed to load (since one of the nested imports is 500).
            // in this case a normal update won't work and a full reload is needed.
            if (isFirstUpdate && hasErrorOverlay()) {
                window.location.reload();
                return;
            }
            else {
                clearErrorOverlay();
                isFirstUpdate = false;
            }
            payload.updates.forEach((update) => {
                if (update.type === 'js-update') {
                    queueUpdate(fetchUpdate(update));
                }
                else {
                    // css-update
                    // this is only sent when a css file referenced with <link> is updated
                    const { path, timestamp } = update;
                    const searchUrl = cleanUrl(path);
                    // can't use querySelector with `[href*=]` here since the link may be
                    // using relative paths so we need to use link.href to grab the full
                    // URL for the include check.
                    const el = Array.from(document.querySelectorAll('link')).find((e) => cleanUrl(e.href).includes(searchUrl));
                    if (el) {
                        const newPath = `${base}${searchUrl.slice(1)}${searchUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
                        // rather than swapping the href on the existing tag, we will
                        // create a new link tag. Once the new stylesheet has loaded we
                        // will remove the existing link tag. This removes a Flash Of
                        // Unstyled Content that can occur when swapping out the tag href
                        // directly, as the new stylesheet has not yet been loaded.
                        const newLinkTag = el.cloneNode();
                        newLinkTag.href = new URL(newPath, el.href).href;
                        const removeOldEl = () => el.remove();
                        newLinkTag.addEventListener('load', removeOldEl);
                        newLinkTag.addEventListener('error', removeOldEl);
                        el.after(newLinkTag);
                    }
                    console.log(`[vite] css hot updated: ${searchUrl}`);
                }
            });
            break;
        case 'custom': {
            notifyListeners(payload.event, payload.data);
            break;
        }
        case 'full-reload':
            notifyListeners('vite:beforeFullReload', payload);
            if (payload.path && payload.path.endsWith('.html')) {
                // if html file is edited, only reload the page if the browser is
                // currently on that page.
                const pagePath = decodeURI(location.pathname);
                const payloadPath = base + payload.path.slice(1);
                if (pagePath === payloadPath ||
                    payload.path === '/index.html' ||
                    (pagePath.endsWith('/') && pagePath + 'index.html' === payloadPath)) {
                    location.reload();
                }
                return;
            }
            else {
                location.reload();
            }
            break;
        case 'prune':
            notifyListeners('vite:beforePrune', payload);
            // After an HMR update, some modules are no longer imported on the page
            // but they may have left behind side effects that need to be cleaned up
            // (.e.g style injections)
            // TODO Trigger their dispose callbacks.
            payload.paths.forEach((path) => {
                const fn = pruneMap.get(path);
                if (fn) {
                    fn(dataMap.get(path));
                }
            });
            break;
        case 'error': {
            notifyListeners('vite:error', payload);
            const err = payload.err;
            if (enableOverlay) {
                createErrorOverlay(err);
            }
            else {
                console.error(`[vite] Internal Server Error\n${err.message}\n${err.stack}`);
            }
            break;
        }
        default: {
            const check = payload;
            return check;
        }
    }
}
function notifyListeners(event, data) {
    const cbs = customListenersMap.get(event);
    if (cbs) {
        cbs.forEach((cb) => cb(data));
    }
}
const enableOverlay = true;
function createErrorOverlay(err) {
    if (!enableOverlay)
        return;
    clearErrorOverlay();
    document.body.appendChild(new ErrorOverlay(err));
}
function clearErrorOverlay() {
    document
        .querySelectorAll(overlayId)
        .forEach((n) => n.close());
}
function hasErrorOverlay() {
    return document.querySelectorAll(overlayId).length;
}
let pending = false;
let queued = [];
/**
 * buffer multiple hot updates triggered by the same src change
 * so that they are invoked in the same order they were sent.
 * (otherwise the order may be inconsistent because of the http request round trip)
 */
async function queueUpdate(p) {
    queued.push(p);
    if (!pending) {
        pending = true;
        await Promise.resolve();
        pending = false;
        const loading = [...queued];
        queued = [];
        (await Promise.all(loading)).forEach((fn) => fn && fn());
    }
}
async function waitForSuccessfulPing(hostAndPath, ms = 1000) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            // A fetch on a websocket URL will return a successful promise with status 400,
            // but will reject a networking error.
            // When running on middleware mode, it returns status 426, and an cors error happens if mode is not no-cors
            await fetch(`${location.protocol}//${hostAndPath}`, { mode: 'no-cors' });
            break;
        }
        catch (e) {
            // wait ms before attempting to ping again
            await new Promise((resolve) => setTimeout(resolve, ms));
        }
    }
}
const sheetsMap = new Map();
function updateStyle(id, content) {
    let style = sheetsMap.get(id);
    {
        if (style && !(style instanceof HTMLStyleElement)) {
            removeStyle(id);
            style = undefined;
        }
        if (!style) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.innerHTML = content;
            document.head.appendChild(style);
        }
        else {
            style.innerHTML = content;
        }
    }
    sheetsMap.set(id, style);
}
function removeStyle(id) {
    const style = sheetsMap.get(id);
    if (style) {
        if (style instanceof CSSStyleSheet) {
            // @ts-expect-error: using experimental API
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== style);
        }
        else {
            document.head.removeChild(style);
        }
        sheetsMap.delete(id);
    }
}
async function fetchUpdate({ path, acceptedPath, timestamp }) {
    const mod = hotModulesMap.get(path);
    if (!mod) {
        // In a code-splitting project,
        // it is common that the hot-updating module is not loaded yet.
        // https://github.com/vitejs/vite/issues/721
        return;
    }
    const moduleMap = new Map();
    const isSelfUpdate = path === acceptedPath;
    // make sure we only import each dep once
    const modulesToUpdate = new Set();
    if (isSelfUpdate) {
        // self update - only update self
        modulesToUpdate.add(path);
    }
    else {
        // dep update
        for (const { deps } of mod.callbacks) {
            deps.forEach((dep) => {
                if (acceptedPath === dep) {
                    modulesToUpdate.add(dep);
                }
            });
        }
    }
    // determine the qualified callbacks before we re-import the modules
    const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => {
        return deps.some((dep) => modulesToUpdate.has(dep));
    });
    await Promise.all(Array.from(modulesToUpdate).map(async (dep) => {
        const disposer = disposeMap.get(dep);
        if (disposer)
            await disposer(dataMap.get(dep));
        const [path, query] = dep.split(`?`);
        try {
            const newMod = await import(
            /* @vite-ignore */
            base +
                path.slice(1) +
                `?import&t=${timestamp}${query ? `&${query}` : ''}`);
            moduleMap.set(dep, newMod);
        }
        catch (e) {
            warnFailedFetch(e, dep);
        }
    }));
    return () => {
        for (const { deps, fn } of qualifiedCallbacks) {
            fn(deps.map((dep) => moduleMap.get(dep)));
        }
        const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
        console.log(`[vite] hot updated: ${loggedPath}`);
    };
}
function sendMessageBuffer() {
    if (socket.readyState === 1) {
        messageBuffer.forEach((msg) => socket.send(msg));
        messageBuffer.length = 0;
    }
}
const hotModulesMap = new Map();
const disposeMap = new Map();
const pruneMap = new Map();
const dataMap = new Map();
const customListenersMap = new Map();
const ctxToListenersMap = new Map();
function createHotContext(ownerPath) {
    if (!dataMap.has(ownerPath)) {
        dataMap.set(ownerPath, {});
    }
    // when a file is hot updated, a new context is created
    // clear its stale callbacks
    const mod = hotModulesMap.get(ownerPath);
    if (mod) {
        mod.callbacks = [];
    }
    // clear stale custom event listeners
    const staleListeners = ctxToListenersMap.get(ownerPath);
    if (staleListeners) {
        for (const [event, staleFns] of staleListeners) {
            const listeners = customListenersMap.get(event);
            if (listeners) {
                customListenersMap.set(event, listeners.filter((l) => !staleFns.includes(l)));
            }
        }
    }
    const newListeners = new Map();
    ctxToListenersMap.set(ownerPath, newListeners);
    function acceptDeps(deps, callback = () => { }) {
        const mod = hotModulesMap.get(ownerPath) || {
            id: ownerPath,
            callbacks: []
        };
        mod.callbacks.push({
            deps,
            fn: callback
        });
        hotModulesMap.set(ownerPath, mod);
    }
    const hot = {
        get data() {
            return dataMap.get(ownerPath);
        },
        accept(deps, callback) {
            if (typeof deps === 'function' || !deps) {
                // self-accept: hot.accept(() => {})
                acceptDeps([ownerPath], ([mod]) => deps && deps(mod));
            }
            else if (typeof deps === 'string') {
                // explicit deps
                acceptDeps([deps], ([mod]) => callback && callback(mod));
            }
            else if (Array.isArray(deps)) {
                acceptDeps(deps, callback);
            }
            else {
                throw new Error(`invalid hot.accept() usage.`);
            }
        },
        // export names (first arg) are irrelevant on the client side, they're
        // extracted in the server for propagation
        acceptExports(_, callback) {
            acceptDeps([ownerPath], callback && (([mod]) => callback(mod)));
        },
        dispose(cb) {
            disposeMap.set(ownerPath, cb);
        },
        // @ts-expect-error untyped
        prune(cb) {
            pruneMap.set(ownerPath, cb);
        },
        // TODO
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        decline() { },
        invalidate() {
            // TODO should tell the server to re-perform hmr propagation
            // from this module as root
            location.reload();
        },
        // custom events
        on(event, cb) {
            const addToMap = (map) => {
                const existing = map.get(event) || [];
                existing.push(cb);
                map.set(event, existing);
            };
            addToMap(customListenersMap);
            addToMap(newListeners);
        },
        send(event, data) {
            messageBuffer.push(JSON.stringify({ type: 'custom', event, data }));
            sendMessageBuffer();
        }
    };
    return hot;
}
/**
 * urls here are dynamic import() urls that couldn't be statically analyzed
 */
function injectQuery(url, queryToInject) {
    // skip urls that won't be handled by vite
    if (!url.startsWith('.') && !url.startsWith('/')) {
        return url;
    }
    // can't use pathname from URL since it may be relative like ../
    const pathname = url.replace(/#.*$/, '').replace(/\?.*$/, '');
    const { search, hash } = new URL(url, 'http://vitejs.dev');
    return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ''}${hash || ''}`;
}

export { ErrorOverlay, createHotContext, injectQuery, removeStyle, updateStyle };
//# sourceMappingURL=client.mjs.map

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC9vdmVybGF5LnRzIiwiLi4vLi4vc3JjL2NsaWVudC9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFcnJvclBheWxvYWQgfSBmcm9tICd0eXBlcy9obXJQYXlsb2FkJ1xuXG5jb25zdCB0ZW1wbGF0ZSA9IC8qaHRtbCovIGBcbjxzdHlsZT5cbjpob3N0IHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiA5OTk5OTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdy15OiBzY3JvbGw7XG4gIG1hcmdpbjogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjY2KTtcbiAgLS1tb25vc3BhY2U6ICdTRk1vbm8tUmVndWxhcicsIENvbnNvbGFzLFxuICAgICAgICAgICAgICAnTGliZXJhdGlvbiBNb25vJywgTWVubG8sIENvdXJpZXIsIG1vbm9zcGFjZTtcbiAgLS1yZWQ6ICNmZjU1NTU7XG4gIC0teWVsbG93OiAjZTJhYTUzO1xuICAtLXB1cnBsZTogI2NmYTRmZjtcbiAgLS1jeWFuOiAjMmRkOWRhO1xuICAtLWRpbTogI2M5YzljOTtcbn1cblxuLndpbmRvdyB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1tb25vc3BhY2UpO1xuICBsaW5lLWhlaWdodDogMS41O1xuICB3aWR0aDogODAwcHg7XG4gIGNvbG9yOiAjZDhkOGQ4O1xuICBtYXJnaW46IDMwcHggYXV0bztcbiAgcGFkZGluZzogMjVweCA0MHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6ICMxODE4MTg7XG4gIGJvcmRlci1yYWRpdXM6IDZweCA2cHggOHB4IDhweDtcbiAgYm94LXNoYWRvdzogMCAxOXB4IDM4cHggcmdiYSgwLDAsMCwwLjMwKSwgMCAxNXB4IDEycHggcmdiYSgwLDAsMCwwLjIyKTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm9yZGVyLXRvcDogOHB4IHNvbGlkIHZhcigtLXJlZCk7XG4gIGRpcmVjdGlvbjogbHRyO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG5wcmUge1xuICBmb250LWZhbWlseTogdmFyKC0tbW9ub3NwYWNlKTtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBtYXJnaW4tdG9wOiAwO1xuICBtYXJnaW4tYm90dG9tOiAxZW07XG4gIG92ZXJmbG93LXg6IHNjcm9sbDtcbiAgc2Nyb2xsYmFyLXdpZHRoOiBub25lO1xufVxuXG5wcmU6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLm1lc3NhZ2Uge1xuICBsaW5lLWhlaWdodDogMS4zO1xuICBmb250LXdlaWdodDogNjAwO1xuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG59XG5cbi5tZXNzYWdlLWJvZHkge1xuICBjb2xvcjogdmFyKC0tcmVkKTtcbn1cblxuLnBsdWdpbiB7XG4gIGNvbG9yOiB2YXIoLS1wdXJwbGUpO1xufVxuXG4uZmlsZSB7XG4gIGNvbG9yOiB2YXIoLS1jeWFuKTtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG59XG5cbi5mcmFtZSB7XG4gIGNvbG9yOiB2YXIoLS15ZWxsb3cpO1xufVxuXG4uc3RhY2sge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGNvbG9yOiB2YXIoLS1kaW0pO1xufVxuXG4udGlwIHtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBjb2xvcjogIzk5OTtcbiAgYm9yZGVyLXRvcDogMXB4IGRvdHRlZCAjOTk5O1xuICBwYWRkaW5nLXRvcDogMTNweDtcbn1cblxuY29kZSB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC1mYW1pbHk6IHZhcigtLW1vbm9zcGFjZSk7XG4gIGNvbG9yOiB2YXIoLS15ZWxsb3cpO1xufVxuXG4uZmlsZS1saW5rIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbjwvc3R5bGU+XG48ZGl2IGNsYXNzPVwid2luZG93XCI+XG4gIDxwcmUgY2xhc3M9XCJtZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJwbHVnaW5cIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJtZXNzYWdlLWJvZHlcIj48L3NwYW4+PC9wcmU+XG4gIDxwcmUgY2xhc3M9XCJmaWxlXCI+PC9wcmU+XG4gIDxwcmUgY2xhc3M9XCJmcmFtZVwiPjwvcHJlPlxuICA8cHJlIGNsYXNzPVwic3RhY2tcIj48L3ByZT5cbiAgPGRpdiBjbGFzcz1cInRpcFwiPlxuICAgIENsaWNrIG91dHNpZGUgb3IgZml4IHRoZSBjb2RlIHRvIGRpc21pc3MuPGJyPlxuICAgIFlvdSBjYW4gYWxzbyBkaXNhYmxlIHRoaXMgb3ZlcmxheSBieSBzZXR0aW5nXG4gICAgPGNvZGU+c2VydmVyLmhtci5vdmVybGF5PC9jb2RlPiB0byA8Y29kZT5mYWxzZTwvY29kZT4gaW4gPGNvZGU+dml0ZS5jb25maWcuanMuPC9jb2RlPlxuICA8L2Rpdj5cbjwvZGl2PlxuYFxuXG5jb25zdCBmaWxlUkUgPSAvKD86W2EtekEtWl06XFxcXHxcXC8pLio/OlxcZCs6XFxkKy9nXG5jb25zdCBjb2RlZnJhbWVSRSA9IC9eKD86Pj9cXHMrXFxkK1xccytcXHwuKnxcXHMrXFx8XFxzKlxcXi4qKVxccj9cXG4vZ21cblxuLy8gQWxsb3cgYEVycm9yT3ZlcmxheWAgdG8gZXh0ZW5kIGBIVE1MRWxlbWVudGAgZXZlbiBpbiBlbnZpcm9ubWVudHMgd2hlcmVcbi8vIGBIVE1MRWxlbWVudGAgd2FzIG5vdCBvcmlnaW5hbGx5IGRlZmluZWQuXG5jb25zdCB7IEhUTUxFbGVtZW50ID0gY2xhc3Mge30gYXMgdHlwZW9mIGdsb2JhbFRoaXMuSFRNTEVsZW1lbnQgfSA9IGdsb2JhbFRoaXNcbmV4cG9ydCBjbGFzcyBFcnJvck92ZXJsYXkgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHJvb3Q6IFNoYWRvd1Jvb3RcblxuICBjb25zdHJ1Y3RvcihlcnI6IEVycm9yUGF5bG9hZFsnZXJyJ10pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5yb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcbiAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gdGVtcGxhdGVcblxuICAgIGNvZGVmcmFtZVJFLmxhc3RJbmRleCA9IDBcbiAgICBjb25zdCBoYXNGcmFtZSA9IGVyci5mcmFtZSAmJiBjb2RlZnJhbWVSRS50ZXN0KGVyci5mcmFtZSlcbiAgICBjb25zdCBtZXNzYWdlID0gaGFzRnJhbWVcbiAgICAgID8gZXJyLm1lc3NhZ2UucmVwbGFjZShjb2RlZnJhbWVSRSwgJycpXG4gICAgICA6IGVyci5tZXNzYWdlXG4gICAgaWYgKGVyci5wbHVnaW4pIHtcbiAgICAgIHRoaXMudGV4dCgnLnBsdWdpbicsIGBbcGx1Z2luOiR7ZXJyLnBsdWdpbn1dIGApXG4gICAgfVxuICAgIHRoaXMudGV4dCgnLm1lc3NhZ2UtYm9keScsIG1lc3NhZ2UudHJpbSgpKVxuXG4gICAgY29uc3QgW2ZpbGVdID0gKGVyci5sb2M/LmZpbGUgfHwgZXJyLmlkIHx8ICd1bmtub3duIGZpbGUnKS5zcGxpdChgP2ApXG4gICAgaWYgKGVyci5sb2MpIHtcbiAgICAgIHRoaXMudGV4dCgnLmZpbGUnLCBgJHtmaWxlfToke2Vyci5sb2MubGluZX06JHtlcnIubG9jLmNvbHVtbn1gLCB0cnVlKVxuICAgIH0gZWxzZSBpZiAoZXJyLmlkKSB7XG4gICAgICB0aGlzLnRleHQoJy5maWxlJywgZmlsZSlcbiAgICB9XG5cbiAgICBpZiAoaGFzRnJhbWUpIHtcbiAgICAgIHRoaXMudGV4dCgnLmZyYW1lJywgZXJyLmZyYW1lIS50cmltKCkpXG4gICAgfVxuICAgIHRoaXMudGV4dCgnLnN0YWNrJywgZXJyLnN0YWNrLCB0cnVlKVxuXG4gICAgdGhpcy5yb290LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKSEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2UoKVxuICAgIH0pXG4gIH1cblxuICB0ZXh0KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgbGlua0ZpbGVzID0gZmFsc2UpOiB2b2lkIHtcbiAgICBjb25zdCBlbCA9IHRoaXMucm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSFcbiAgICBpZiAoIWxpbmtGaWxlcykge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSB0ZXh0XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjdXJJbmRleCA9IDBcbiAgICAgIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbFxuICAgICAgd2hpbGUgKChtYXRjaCA9IGZpbGVSRS5leGVjKHRleHQpKSkge1xuICAgICAgICBjb25zdCB7IDA6IGZpbGUsIGluZGV4IH0gPSBtYXRjaFxuICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IGZyYWcgPSB0ZXh0LnNsaWNlKGN1ckluZGV4LCBpbmRleClcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmcmFnKSlcbiAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgICAgICAgbGluay50ZXh0Q29udGVudCA9IGZpbGVcbiAgICAgICAgICBsaW5rLmNsYXNzTmFtZSA9ICdmaWxlLWxpbmsnXG4gICAgICAgICAgbGluay5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgZmV0Y2goJy9fX29wZW4taW4tZWRpdG9yP2ZpbGU9JyArIGVuY29kZVVSSUNvbXBvbmVudChmaWxlKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobGluaylcbiAgICAgICAgICBjdXJJbmRleCArPSBmcmFnLmxlbmd0aCArIGZpbGUubGVuZ3RoXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRoaXMpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG92ZXJsYXlJZCA9ICd2aXRlLWVycm9yLW92ZXJsYXknXG5jb25zdCB7IGN1c3RvbUVsZW1lbnRzIH0gPSBnbG9iYWxUaGlzIC8vIEVuc3VyZSBgY3VzdG9tRWxlbWVudHNgIGlzIGRlZmluZWQgYmVmb3JlIHRoZSBuZXh0IGxpbmUuXG5pZiAoY3VzdG9tRWxlbWVudHMgJiYgIWN1c3RvbUVsZW1lbnRzLmdldChvdmVybGF5SWQpKSB7XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShvdmVybGF5SWQsIEVycm9yT3ZlcmxheSlcbn1cbiIsImltcG9ydCB0eXBlIHsgRXJyb3JQYXlsb2FkLCBITVJQYXlsb2FkLCBVcGRhdGUgfSBmcm9tICd0eXBlcy9obXJQYXlsb2FkJ1xuaW1wb3J0IHR5cGUgeyBNb2R1bGVOYW1lc3BhY2UsIFZpdGVIb3RDb250ZXh0IH0gZnJvbSAndHlwZXMvaG90J1xuaW1wb3J0IHR5cGUgeyBJbmZlckN1c3RvbUV2ZW50UGF5bG9hZCB9IGZyb20gJ3R5cGVzL2N1c3RvbUV2ZW50J1xuaW1wb3J0IHsgRXJyb3JPdmVybGF5LCBvdmVybGF5SWQgfSBmcm9tICcuL292ZXJsYXknXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby1taXNzaW5nLWltcG9ydFxuaW1wb3J0ICdAdml0ZS9lbnYnXG5cbi8vIGluamVjdGVkIGJ5IHRoZSBobXIgcGx1Z2luIHdoZW4gc2VydmVkXG5kZWNsYXJlIGNvbnN0IF9fQkFTRV9fOiBzdHJpbmdcbmRlY2xhcmUgY29uc3QgX19TRVJWRVJfSE9TVF9fOiBzdHJpbmdcbmRlY2xhcmUgY29uc3QgX19ITVJfUFJPVE9DT0xfXzogc3RyaW5nIHwgbnVsbFxuZGVjbGFyZSBjb25zdCBfX0hNUl9IT1NUTkFNRV9fOiBzdHJpbmcgfCBudWxsXG5kZWNsYXJlIGNvbnN0IF9fSE1SX1BPUlRfXzogbnVtYmVyIHwgbnVsbFxuZGVjbGFyZSBjb25zdCBfX0hNUl9ESVJFQ1RfVEFSR0VUX186IHN0cmluZ1xuZGVjbGFyZSBjb25zdCBfX0hNUl9CQVNFX186IHN0cmluZ1xuZGVjbGFyZSBjb25zdCBfX0hNUl9USU1FT1VUX186IG51bWJlclxuZGVjbGFyZSBjb25zdCBfX0hNUl9FTkFCTEVfT1ZFUkxBWV9fOiBib29sZWFuXG5cbmNvbnNvbGUuZGVidWcoJ1t2aXRlXSBjb25uZWN0aW5nLi4uJylcblxuY29uc3QgaW1wb3J0TWV0YVVybCA9IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKVxuXG4vLyB1c2Ugc2VydmVyIGNvbmZpZ3VyYXRpb24sIHRoZW4gZmFsbGJhY2sgdG8gaW5mZXJlbmNlXG5jb25zdCBzZXJ2ZXJIb3N0ID0gX19TRVJWRVJfSE9TVF9fXG5jb25zdCBzb2NrZXRQcm90b2NvbCA9XG4gIF9fSE1SX1BST1RPQ09MX18gfHwgKGxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cHM6JyA/ICd3c3MnIDogJ3dzJylcbmNvbnN0IGhtclBvcnQgPSBfX0hNUl9QT1JUX19cbmNvbnN0IHNvY2tldEhvc3QgPSBgJHtfX0hNUl9IT1NUTkFNRV9fIHx8IGltcG9ydE1ldGFVcmwuaG9zdG5hbWV9OiR7XG4gIGhtclBvcnQgfHwgaW1wb3J0TWV0YVVybC5wb3J0XG59JHtfX0hNUl9CQVNFX199YFxuY29uc3QgZGlyZWN0U29ja2V0SG9zdCA9IF9fSE1SX0RJUkVDVF9UQVJHRVRfX1xuY29uc3QgYmFzZSA9IF9fQkFTRV9fIHx8ICcvJ1xuY29uc3QgbWVzc2FnZUJ1ZmZlcjogc3RyaW5nW10gPSBbXVxuXG5sZXQgc29ja2V0OiBXZWJTb2NrZXRcbnRyeSB7XG4gIGxldCBmYWxsYmFjazogKCgpID0+IHZvaWQpIHwgdW5kZWZpbmVkXG4gIC8vIG9ubHkgdXNlIGZhbGxiYWNrIHdoZW4gcG9ydCBpcyBpbmZlcnJlZCB0byBwcmV2ZW50IGNvbmZ1c2lvblxuICBpZiAoIWhtclBvcnQpIHtcbiAgICBmYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIC8vIGZhbGxiYWNrIHRvIGNvbm5lY3RpbmcgZGlyZWN0bHkgdG8gdGhlIGhtciBzZXJ2ZXJcbiAgICAgIC8vIGZvciBzZXJ2ZXJzIHdoaWNoIGRvZXMgbm90IHN1cHBvcnQgcHJveHlpbmcgd2Vic29ja2V0XG4gICAgICBzb2NrZXQgPSBzZXR1cFdlYlNvY2tldChzb2NrZXRQcm90b2NvbCwgZGlyZWN0U29ja2V0SG9zdCwgKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50U2NyaXB0SG9zdFVSTCA9IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKVxuICAgICAgICBjb25zdCBjdXJyZW50U2NyaXB0SG9zdCA9XG4gICAgICAgICAgY3VycmVudFNjcmlwdEhvc3RVUkwuaG9zdCArXG4gICAgICAgICAgY3VycmVudFNjcmlwdEhvc3RVUkwucGF0aG5hbWUucmVwbGFjZSgvQHZpdGVcXC9jbGllbnQkLywgJycpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ1t2aXRlXSBmYWlsZWQgdG8gY29ubmVjdCB0byB3ZWJzb2NrZXQuXFxuJyArXG4gICAgICAgICAgICAneW91ciBjdXJyZW50IHNldHVwOlxcbicgK1xuICAgICAgICAgICAgYCAgKGJyb3dzZXIpICR7Y3VycmVudFNjcmlwdEhvc3R9IDwtLVtIVFRQXS0tPiAke3NlcnZlckhvc3R9IChzZXJ2ZXIpXFxuYCArXG4gICAgICAgICAgICBgICAoYnJvd3NlcikgJHtzb2NrZXRIb3N0fSA8LS1bV2ViU29ja2V0IChmYWlsaW5nKV0tLT4gJHtkaXJlY3RTb2NrZXRIb3N0fSAoc2VydmVyKVxcbmAgK1xuICAgICAgICAgICAgJ0NoZWNrIG91dCB5b3VyIFZpdGUgLyBuZXR3b3JrIGNvbmZpZ3VyYXRpb24gYW5kIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvc2VydmVyLW9wdGlvbnMuaHRtbCNzZXJ2ZXItaG1yIC4nXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ29wZW4nLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgJ1t2aXRlXSBEaXJlY3Qgd2Vic29ja2V0IGNvbm5lY3Rpb24gZmFsbGJhY2suIENoZWNrIG91dCBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL3NlcnZlci1vcHRpb25zLmh0bWwjc2VydmVyLWhtciB0byByZW1vdmUgdGhlIHByZXZpb3VzIGNvbm5lY3Rpb24gZXJyb3IuJ1xuICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBzb2NrZXQgPSBzZXR1cFdlYlNvY2tldChzb2NrZXRQcm90b2NvbCwgc29ja2V0SG9zdCwgZmFsbGJhY2spXG59IGNhdGNoIChlcnJvcikge1xuICBjb25zb2xlLmVycm9yKGBbdml0ZV0gZmFpbGVkIHRvIGNvbm5lY3QgdG8gd2Vic29ja2V0ICgke2Vycm9yfSkuIGApXG59XG5cbmZ1bmN0aW9uIHNldHVwV2ViU29ja2V0KFxuICBwcm90b2NvbDogc3RyaW5nLFxuICBob3N0QW5kUGF0aDogc3RyaW5nLFxuICBvbkNsb3NlV2l0aG91dE9wZW4/OiAoKSA9PiB2b2lkXG4pIHtcbiAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChgJHtwcm90b2NvbH06Ly8ke2hvc3RBbmRQYXRofWAsICd2aXRlLWhtcicpXG4gIGxldCBpc09wZW5lZCA9IGZhbHNlXG5cbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ29wZW4nLFxuICAgICgpID0+IHtcbiAgICAgIGlzT3BlbmVkID0gdHJ1ZVxuICAgIH0sXG4gICAgeyBvbmNlOiB0cnVlIH1cbiAgKVxuXG4gIC8vIExpc3RlbiBmb3IgbWVzc2FnZXNcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBhc3luYyAoeyBkYXRhIH0pID0+IHtcbiAgICBoYW5kbGVNZXNzYWdlKEpTT04ucGFyc2UoZGF0YSkpXG4gIH0pXG5cbiAgLy8gcGluZyBzZXJ2ZXJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgYXN5bmMgKHsgd2FzQ2xlYW4gfSkgPT4ge1xuICAgIGlmICh3YXNDbGVhbikgcmV0dXJuXG5cbiAgICBpZiAoIWlzT3BlbmVkICYmIG9uQ2xvc2VXaXRob3V0T3Blbikge1xuICAgICAgb25DbG9zZVdpdGhvdXRPcGVuKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBbdml0ZV0gc2VydmVyIGNvbm5lY3Rpb24gbG9zdC4gcG9sbGluZyBmb3IgcmVzdGFydC4uLmApXG4gICAgYXdhaXQgd2FpdEZvclN1Y2Nlc3NmdWxQaW5nKGhvc3RBbmRQYXRoKVxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH0pXG5cbiAgcmV0dXJuIHNvY2tldFxufVxuXG5mdW5jdGlvbiB3YXJuRmFpbGVkRmV0Y2goZXJyOiBFcnJvciwgcGF0aDogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgaWYgKCFlcnIubWVzc2FnZS5tYXRjaCgnZmV0Y2gnKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgYFtobXJdIEZhaWxlZCB0byByZWxvYWQgJHtwYXRofS4gYCArXG4gICAgICBgVGhpcyBjb3VsZCBiZSBkdWUgdG8gc3ludGF4IGVycm9ycyBvciBpbXBvcnRpbmcgbm9uLWV4aXN0ZW50IGAgK1xuICAgICAgYG1vZHVsZXMuIChzZWUgZXJyb3JzIGFib3ZlKWBcbiAgKVxufVxuXG5mdW5jdGlvbiBjbGVhblVybChwYXRobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdXJsID0gbmV3IFVSTChwYXRobmFtZSwgbG9jYXRpb24udG9TdHJpbmcoKSlcbiAgdXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoJ2RpcmVjdCcpXG4gIHJldHVybiB1cmwucGF0aG5hbWUgKyB1cmwuc2VhcmNoXG59XG5cbmxldCBpc0ZpcnN0VXBkYXRlID0gdHJ1ZVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKHBheWxvYWQ6IEhNUlBheWxvYWQpIHtcbiAgc3dpdGNoIChwYXlsb2FkLnR5cGUpIHtcbiAgICBjYXNlICdjb25uZWN0ZWQnOlxuICAgICAgY29uc29sZS5kZWJ1ZyhgW3ZpdGVdIGNvbm5lY3RlZC5gKVxuICAgICAgc2VuZE1lc3NhZ2VCdWZmZXIoKVxuICAgICAgLy8gcHJveHkobmdpbngsIGRvY2tlcikgaG1yIHdzIG1heWJlIGNhdXNlZCB0aW1lb3V0LFxuICAgICAgLy8gc28gc2VuZCBwaW5nIHBhY2thZ2UgbGV0IHdzIGtlZXAgYWxpdmUuXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChzb2NrZXQucmVhZHlTdGF0ZSA9PT0gc29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgne1widHlwZVwiOlwicGluZ1wifScpXG4gICAgICAgIH1cbiAgICAgIH0sIF9fSE1SX1RJTUVPVVRfXylcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXBkYXRlJzpcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTpiZWZvcmVVcGRhdGUnLCBwYXlsb2FkKVxuICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgZmlyc3QgdXBkYXRlIGFuZCB0aGVyZSdzIGFscmVhZHkgYW4gZXJyb3Igb3ZlcmxheSwgaXRcbiAgICAgIC8vIG1lYW5zIHRoZSBwYWdlIG9wZW5lZCB3aXRoIGV4aXN0aW5nIHNlcnZlciBjb21waWxlIGVycm9yIGFuZCB0aGUgd2hvbGVcbiAgICAgIC8vIG1vZHVsZSBzY3JpcHQgZmFpbGVkIHRvIGxvYWQgKHNpbmNlIG9uZSBvZiB0aGUgbmVzdGVkIGltcG9ydHMgaXMgNTAwKS5cbiAgICAgIC8vIGluIHRoaXMgY2FzZSBhIG5vcm1hbCB1cGRhdGUgd29uJ3Qgd29yayBhbmQgYSBmdWxsIHJlbG9hZCBpcyBuZWVkZWQuXG4gICAgICBpZiAoaXNGaXJzdFVwZGF0ZSAmJiBoYXNFcnJvck92ZXJsYXkoKSkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhckVycm9yT3ZlcmxheSgpXG4gICAgICAgIGlzRmlyc3RVcGRhdGUgPSBmYWxzZVxuICAgICAgfVxuICAgICAgcGF5bG9hZC51cGRhdGVzLmZvckVhY2goKHVwZGF0ZSkgPT4ge1xuICAgICAgICBpZiAodXBkYXRlLnR5cGUgPT09ICdqcy11cGRhdGUnKSB7XG4gICAgICAgICAgcXVldWVVcGRhdGUoZmV0Y2hVcGRhdGUodXBkYXRlKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjc3MtdXBkYXRlXG4gICAgICAgICAgLy8gdGhpcyBpcyBvbmx5IHNlbnQgd2hlbiBhIGNzcyBmaWxlIHJlZmVyZW5jZWQgd2l0aCA8bGluaz4gaXMgdXBkYXRlZFxuICAgICAgICAgIGNvbnN0IHsgcGF0aCwgdGltZXN0YW1wIH0gPSB1cGRhdGVcbiAgICAgICAgICBjb25zdCBzZWFyY2hVcmwgPSBjbGVhblVybChwYXRoKVxuICAgICAgICAgIC8vIGNhbid0IHVzZSBxdWVyeVNlbGVjdG9yIHdpdGggYFtocmVmKj1dYCBoZXJlIHNpbmNlIHRoZSBsaW5rIG1heSBiZVxuICAgICAgICAgIC8vIHVzaW5nIHJlbGF0aXZlIHBhdGhzIHNvIHdlIG5lZWQgdG8gdXNlIGxpbmsuaHJlZiB0byBncmFiIHRoZSBmdWxsXG4gICAgICAgICAgLy8gVVJMIGZvciB0aGUgaW5jbHVkZSBjaGVjay5cbiAgICAgICAgICBjb25zdCBlbCA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxMaW5rRWxlbWVudD4oJ2xpbmsnKVxuICAgICAgICAgICkuZmluZCgoZSkgPT4gY2xlYW5VcmwoZS5ocmVmKS5pbmNsdWRlcyhzZWFyY2hVcmwpKVxuICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IGAke2Jhc2V9JHtzZWFyY2hVcmwuc2xpY2UoMSl9JHtcbiAgICAgICAgICAgICAgc2VhcmNoVXJsLmluY2x1ZGVzKCc/JykgPyAnJicgOiAnPydcbiAgICAgICAgICAgIH10PSR7dGltZXN0YW1wfWBcblxuICAgICAgICAgICAgLy8gcmF0aGVyIHRoYW4gc3dhcHBpbmcgdGhlIGhyZWYgb24gdGhlIGV4aXN0aW5nIHRhZywgd2Ugd2lsbFxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGxpbmsgdGFnLiBPbmNlIHRoZSBuZXcgc3R5bGVzaGVldCBoYXMgbG9hZGVkIHdlXG4gICAgICAgICAgICAvLyB3aWxsIHJlbW92ZSB0aGUgZXhpc3RpbmcgbGluayB0YWcuIFRoaXMgcmVtb3ZlcyBhIEZsYXNoIE9mXG4gICAgICAgICAgICAvLyBVbnN0eWxlZCBDb250ZW50IHRoYXQgY2FuIG9jY3VyIHdoZW4gc3dhcHBpbmcgb3V0IHRoZSB0YWcgaHJlZlxuICAgICAgICAgICAgLy8gZGlyZWN0bHksIGFzIHRoZSBuZXcgc3R5bGVzaGVldCBoYXMgbm90IHlldCBiZWVuIGxvYWRlZC5cbiAgICAgICAgICAgIGNvbnN0IG5ld0xpbmtUYWcgPSBlbC5jbG9uZU5vZGUoKSBhcyBIVE1MTGlua0VsZW1lbnRcbiAgICAgICAgICAgIG5ld0xpbmtUYWcuaHJlZiA9IG5ldyBVUkwobmV3UGF0aCwgZWwuaHJlZikuaHJlZlxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlT2xkRWwgPSAoKSA9PiBlbC5yZW1vdmUoKVxuICAgICAgICAgICAgbmV3TGlua1RhZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcmVtb3ZlT2xkRWwpXG4gICAgICAgICAgICBuZXdMaW5rVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgcmVtb3ZlT2xkRWwpXG4gICAgICAgICAgICBlbC5hZnRlcihuZXdMaW5rVGFnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZpdGVdIGNzcyBob3QgdXBkYXRlZDogJHtzZWFyY2hVcmx9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnY3VzdG9tJzoge1xuICAgICAgbm90aWZ5TGlzdGVuZXJzKHBheWxvYWQuZXZlbnQsIHBheWxvYWQuZGF0YSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgJ2Z1bGwtcmVsb2FkJzpcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTpiZWZvcmVGdWxsUmVsb2FkJywgcGF5bG9hZClcbiAgICAgIGlmIChwYXlsb2FkLnBhdGggJiYgcGF5bG9hZC5wYXRoLmVuZHNXaXRoKCcuaHRtbCcpKSB7XG4gICAgICAgIC8vIGlmIGh0bWwgZmlsZSBpcyBlZGl0ZWQsIG9ubHkgcmVsb2FkIHRoZSBwYWdlIGlmIHRoZSBicm93c2VyIGlzXG4gICAgICAgIC8vIGN1cnJlbnRseSBvbiB0aGF0IHBhZ2UuXG4gICAgICAgIGNvbnN0IHBhZ2VQYXRoID0gZGVjb2RlVVJJKGxvY2F0aW9uLnBhdGhuYW1lKVxuICAgICAgICBjb25zdCBwYXlsb2FkUGF0aCA9IGJhc2UgKyBwYXlsb2FkLnBhdGguc2xpY2UoMSlcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBhZ2VQYXRoID09PSBwYXlsb2FkUGF0aCB8fFxuICAgICAgICAgIHBheWxvYWQucGF0aCA9PT0gJy9pbmRleC5odG1sJyB8fFxuICAgICAgICAgIChwYWdlUGF0aC5lbmRzV2l0aCgnLycpICYmIHBhZ2VQYXRoICsgJ2luZGV4Lmh0bWwnID09PSBwYXlsb2FkUGF0aClcbiAgICAgICAgKSB7XG4gICAgICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3BydW5lJzpcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTpiZWZvcmVQcnVuZScsIHBheWxvYWQpXG4gICAgICAvLyBBZnRlciBhbiBITVIgdXBkYXRlLCBzb21lIG1vZHVsZXMgYXJlIG5vIGxvbmdlciBpbXBvcnRlZCBvbiB0aGUgcGFnZVxuICAgICAgLy8gYnV0IHRoZXkgbWF5IGhhdmUgbGVmdCBiZWhpbmQgc2lkZSBlZmZlY3RzIHRoYXQgbmVlZCB0byBiZSBjbGVhbmVkIHVwXG4gICAgICAvLyAoLmUuZyBzdHlsZSBpbmplY3Rpb25zKVxuICAgICAgLy8gVE9ETyBUcmlnZ2VyIHRoZWlyIGRpc3Bvc2UgY2FsbGJhY2tzLlxuICAgICAgcGF5bG9hZC5wYXRocy5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZuID0gcHJ1bmVNYXAuZ2V0KHBhdGgpXG4gICAgICAgIGlmIChmbikge1xuICAgICAgICAgIGZuKGRhdGFNYXAuZ2V0KHBhdGgpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdlcnJvcic6IHtcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTplcnJvcicsIHBheWxvYWQpXG4gICAgICBjb25zdCBlcnIgPSBwYXlsb2FkLmVyclxuICAgICAgaWYgKGVuYWJsZU92ZXJsYXkpIHtcbiAgICAgICAgY3JlYXRlRXJyb3JPdmVybGF5KGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYFt2aXRlXSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcXG4ke2Vyci5tZXNzYWdlfVxcbiR7ZXJyLnN0YWNrfWBcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgY29uc3QgY2hlY2s6IG5ldmVyID0gcGF5bG9hZFxuICAgICAgcmV0dXJuIGNoZWNrXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vdGlmeUxpc3RlbmVyczxUIGV4dGVuZHMgc3RyaW5nPihcbiAgZXZlbnQ6IFQsXG4gIGRhdGE6IEluZmVyQ3VzdG9tRXZlbnRQYXlsb2FkPFQ+XG4pOiB2b2lkXG5mdW5jdGlvbiBub3RpZnlMaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZywgZGF0YTogYW55KTogdm9pZCB7XG4gIGNvbnN0IGNicyA9IGN1c3RvbUxpc3RlbmVyc01hcC5nZXQoZXZlbnQpXG4gIGlmIChjYnMpIHtcbiAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKGRhdGEpKVxuICB9XG59XG5cbmNvbnN0IGVuYWJsZU92ZXJsYXkgPSBfX0hNUl9FTkFCTEVfT1ZFUkxBWV9fXG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yT3ZlcmxheShlcnI6IEVycm9yUGF5bG9hZFsnZXJyJ10pIHtcbiAgaWYgKCFlbmFibGVPdmVybGF5KSByZXR1cm5cbiAgY2xlYXJFcnJvck92ZXJsYXkoKVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5ldyBFcnJvck92ZXJsYXkoZXJyKSlcbn1cblxuZnVuY3Rpb24gY2xlYXJFcnJvck92ZXJsYXkoKSB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3JBbGwob3ZlcmxheUlkKVxuICAgIC5mb3JFYWNoKChuKSA9PiAobiBhcyBFcnJvck92ZXJsYXkpLmNsb3NlKCkpXG59XG5cbmZ1bmN0aW9uIGhhc0Vycm9yT3ZlcmxheSgpIHtcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3ZlcmxheUlkKS5sZW5ndGhcbn1cblxubGV0IHBlbmRpbmcgPSBmYWxzZVxubGV0IHF1ZXVlZDogUHJvbWlzZTwoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ+W10gPSBbXVxuXG4vKipcbiAqIGJ1ZmZlciBtdWx0aXBsZSBob3QgdXBkYXRlcyB0cmlnZ2VyZWQgYnkgdGhlIHNhbWUgc3JjIGNoYW5nZVxuICogc28gdGhhdCB0aGV5IGFyZSBpbnZva2VkIGluIHRoZSBzYW1lIG9yZGVyIHRoZXkgd2VyZSBzZW50LlxuICogKG90aGVyd2lzZSB0aGUgb3JkZXIgbWF5IGJlIGluY29uc2lzdGVudCBiZWNhdXNlIG9mIHRoZSBodHRwIHJlcXVlc3Qgcm91bmQgdHJpcClcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcXVldWVVcGRhdGUocDogUHJvbWlzZTwoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ+KSB7XG4gIHF1ZXVlZC5wdXNoKHApXG4gIGlmICghcGVuZGluZykge1xuICAgIHBlbmRpbmcgPSB0cnVlXG4gICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKClcbiAgICBwZW5kaW5nID0gZmFsc2VcbiAgICBjb25zdCBsb2FkaW5nID0gWy4uLnF1ZXVlZF1cbiAgICBxdWV1ZWQgPSBbXVxuICAgIDsoYXdhaXQgUHJvbWlzZS5hbGwobG9hZGluZykpLmZvckVhY2goKGZuKSA9PiBmbiAmJiBmbigpKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JTdWNjZXNzZnVsUGluZyhob3N0QW5kUGF0aDogc3RyaW5nLCBtcyA9IDEwMDApIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBBIGZldGNoIG9uIGEgd2Vic29ja2V0IFVSTCB3aWxsIHJldHVybiBhIHN1Y2Nlc3NmdWwgcHJvbWlzZSB3aXRoIHN0YXR1cyA0MDAsXG4gICAgICAvLyBidXQgd2lsbCByZWplY3QgYSBuZXR3b3JraW5nIGVycm9yLlxuICAgICAgLy8gV2hlbiBydW5uaW5nIG9uIG1pZGRsZXdhcmUgbW9kZSwgaXQgcmV0dXJucyBzdGF0dXMgNDI2LCBhbmQgYW4gY29ycyBlcnJvciBoYXBwZW5zIGlmIG1vZGUgaXMgbm90IG5vLWNvcnNcbiAgICAgIGF3YWl0IGZldGNoKGAke2xvY2F0aW9uLnByb3RvY29sfS8vJHtob3N0QW5kUGF0aH1gLCB7IG1vZGU6ICduby1jb3JzJyB9KVxuICAgICAgYnJlYWtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB3YWl0IG1zIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHBpbmcgYWdhaW5cbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSlcbiAgICB9XG4gIH1cbn1cblxuLy8gaHR0cHM6Ly93aWNnLmdpdGh1Yi5pby9jb25zdHJ1Y3Qtc3R5bGVzaGVldHNcbmNvbnN0IHN1cHBvcnRzQ29uc3RydWN0ZWRTaGVldCA9ICgoKSA9PiB7XG4gIC8vIFRPRE86IHJlLWVuYWJsZSB0aGlzIHRyeSBibG9jayBvbmNlIENocm9tZSBmaXhlcyB0aGUgcGVyZm9ybWFuY2Ugb2ZcbiAgLy8gcnVsZSBpbnNlcnRpb24gaW4gcmVhbGx5IGJpZyBzdHlsZXNoZWV0c1xuICAvLyB0cnkge1xuICAvLyAgIG5ldyBDU1NTdHlsZVNoZWV0KClcbiAgLy8gICByZXR1cm4gdHJ1ZVxuICAvLyB9IGNhdGNoIChlKSB7fVxuICByZXR1cm4gZmFsc2Vcbn0pKClcblxuY29uc3Qgc2hlZXRzTWFwID0gbmV3IE1hcDxcbiAgc3RyaW5nLFxuICBIVE1MU3R5bGVFbGVtZW50IHwgQ1NTU3R5bGVTaGVldCB8IHVuZGVmaW5lZFxuPigpXG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTdHlsZShpZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcbiAgbGV0IHN0eWxlID0gc2hlZXRzTWFwLmdldChpZClcbiAgaWYgKHN1cHBvcnRzQ29uc3RydWN0ZWRTaGVldCAmJiAhY29udGVudC5pbmNsdWRlcygnQGltcG9ydCcpKSB7XG4gICAgaWYgKHN0eWxlICYmICEoc3R5bGUgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSkge1xuICAgICAgcmVtb3ZlU3R5bGUoaWQpXG4gICAgICBzdHlsZSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGlmICghc3R5bGUpIHtcbiAgICAgIHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKVxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvcjogdXNpbmcgZXhwZXJpbWVudGFsIEFQSVxuICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY29udGVudClcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3I6IHVzaW5nIGV4cGVyaW1lbnRhbCBBUElcbiAgICAgIGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMsIHN0eWxlXVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yOiB1c2luZyBleHBlcmltZW50YWwgQVBJXG4gICAgICBzdHlsZS5yZXBsYWNlU3luYyhjb250ZW50KVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoc3R5bGUgJiYgIShzdHlsZSBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpKSB7XG4gICAgICByZW1vdmVTdHlsZShpZClcbiAgICAgIHN0eWxlID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgaWYgKCFzdHlsZSkge1xuICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKVxuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY29udGVudFxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY29udGVudFxuICAgIH1cbiAgfVxuICBzaGVldHNNYXAuc2V0KGlkLCBzdHlsZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN0eWxlKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3Qgc3R5bGUgPSBzaGVldHNNYXAuZ2V0KGlkKVxuICBpZiAoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yOiB1c2luZyBleHBlcmltZW50YWwgQVBJXG4gICAgICBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgPSBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMuZmlsdGVyKFxuICAgICAgICAoczogQ1NTU3R5bGVTaGVldCkgPT4gcyAhPT0gc3R5bGVcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChzdHlsZSlcbiAgICB9XG4gICAgc2hlZXRzTWFwLmRlbGV0ZShpZClcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFVwZGF0ZSh7IHBhdGgsIGFjY2VwdGVkUGF0aCwgdGltZXN0YW1wIH06IFVwZGF0ZSkge1xuICBjb25zdCBtb2QgPSBob3RNb2R1bGVzTWFwLmdldChwYXRoKVxuICBpZiAoIW1vZCkge1xuICAgIC8vIEluIGEgY29kZS1zcGxpdHRpbmcgcHJvamVjdCxcbiAgICAvLyBpdCBpcyBjb21tb24gdGhhdCB0aGUgaG90LXVwZGF0aW5nIG1vZHVsZSBpcyBub3QgbG9hZGVkIHlldC5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvaXNzdWVzLzcyMVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgbW9kdWxlTWFwID0gbmV3IE1hcDxzdHJpbmcsIE1vZHVsZU5hbWVzcGFjZT4oKVxuICBjb25zdCBpc1NlbGZVcGRhdGUgPSBwYXRoID09PSBhY2NlcHRlZFBhdGhcblxuICAvLyBtYWtlIHN1cmUgd2Ugb25seSBpbXBvcnQgZWFjaCBkZXAgb25jZVxuICBjb25zdCBtb2R1bGVzVG9VcGRhdGUgPSBuZXcgU2V0PHN0cmluZz4oKVxuICBpZiAoaXNTZWxmVXBkYXRlKSB7XG4gICAgLy8gc2VsZiB1cGRhdGUgLSBvbmx5IHVwZGF0ZSBzZWxmXG4gICAgbW9kdWxlc1RvVXBkYXRlLmFkZChwYXRoKVxuICB9IGVsc2Uge1xuICAgIC8vIGRlcCB1cGRhdGVcbiAgICBmb3IgKGNvbnN0IHsgZGVwcyB9IG9mIG1vZC5jYWxsYmFja3MpIHtcbiAgICAgIGRlcHMuZm9yRWFjaCgoZGVwKSA9PiB7XG4gICAgICAgIGlmIChhY2NlcHRlZFBhdGggPT09IGRlcCkge1xuICAgICAgICAgIG1vZHVsZXNUb1VwZGF0ZS5hZGQoZGVwKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIGRldGVybWluZSB0aGUgcXVhbGlmaWVkIGNhbGxiYWNrcyBiZWZvcmUgd2UgcmUtaW1wb3J0IHRoZSBtb2R1bGVzXG4gIGNvbnN0IHF1YWxpZmllZENhbGxiYWNrcyA9IG1vZC5jYWxsYmFja3MuZmlsdGVyKCh7IGRlcHMgfSkgPT4ge1xuICAgIHJldHVybiBkZXBzLnNvbWUoKGRlcCkgPT4gbW9kdWxlc1RvVXBkYXRlLmhhcyhkZXApKVxuICB9KVxuXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIEFycmF5LmZyb20obW9kdWxlc1RvVXBkYXRlKS5tYXAoYXN5bmMgKGRlcCkgPT4ge1xuICAgICAgY29uc3QgZGlzcG9zZXIgPSBkaXNwb3NlTWFwLmdldChkZXApXG4gICAgICBpZiAoZGlzcG9zZXIpIGF3YWl0IGRpc3Bvc2VyKGRhdGFNYXAuZ2V0KGRlcCkpXG4gICAgICBjb25zdCBbcGF0aCwgcXVlcnldID0gZGVwLnNwbGl0KGA/YClcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5ld01vZDogTW9kdWxlTmFtZXNwYWNlID0gYXdhaXQgaW1wb3J0KFxuICAgICAgICAgIC8qIEB2aXRlLWlnbm9yZSAqL1xuICAgICAgICAgIGJhc2UgK1xuICAgICAgICAgICAgcGF0aC5zbGljZSgxKSArXG4gICAgICAgICAgICBgP2ltcG9ydCZ0PSR7dGltZXN0YW1wfSR7cXVlcnkgPyBgJiR7cXVlcnl9YCA6ICcnfWBcbiAgICAgICAgKVxuICAgICAgICBtb2R1bGVNYXAuc2V0KGRlcCwgbmV3TW9kKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3YXJuRmFpbGVkRmV0Y2goZSwgZGVwKVxuICAgICAgfVxuICAgIH0pXG4gIClcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGZvciAoY29uc3QgeyBkZXBzLCBmbiB9IG9mIHF1YWxpZmllZENhbGxiYWNrcykge1xuICAgICAgZm4oZGVwcy5tYXAoKGRlcCkgPT4gbW9kdWxlTWFwLmdldChkZXApKSlcbiAgICB9XG4gICAgY29uc3QgbG9nZ2VkUGF0aCA9IGlzU2VsZlVwZGF0ZSA/IHBhdGggOiBgJHthY2NlcHRlZFBhdGh9IHZpYSAke3BhdGh9YFxuICAgIGNvbnNvbGUubG9nKGBbdml0ZV0gaG90IHVwZGF0ZWQ6ICR7bG9nZ2VkUGF0aH1gKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRNZXNzYWdlQnVmZmVyKCkge1xuICBpZiAoc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICBtZXNzYWdlQnVmZmVyLmZvckVhY2goKG1zZykgPT4gc29ja2V0LnNlbmQobXNnKSlcbiAgICBtZXNzYWdlQnVmZmVyLmxlbmd0aCA9IDBcbiAgfVxufVxuXG5pbnRlcmZhY2UgSG90TW9kdWxlIHtcbiAgaWQ6IHN0cmluZ1xuICBjYWxsYmFja3M6IEhvdENhbGxiYWNrW11cbn1cblxuaW50ZXJmYWNlIEhvdENhbGxiYWNrIHtcbiAgLy8gdGhlIGRlcGVuZGVuY2llcyBtdXN0IGJlIGZldGNoYWJsZSBwYXRoc1xuICBkZXBzOiBzdHJpbmdbXVxuICBmbjogKG1vZHVsZXM6IEFycmF5PE1vZHVsZU5hbWVzcGFjZSB8IHVuZGVmaW5lZD4pID0+IHZvaWRcbn1cblxudHlwZSBDdXN0b21MaXN0ZW5lcnNNYXAgPSBNYXA8c3RyaW5nLCAoKGRhdGE6IGFueSkgPT4gdm9pZClbXT5cblxuY29uc3QgaG90TW9kdWxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBIb3RNb2R1bGU+KClcbmNvbnN0IGRpc3Bvc2VNYXAgPSBuZXcgTWFwPHN0cmluZywgKGRhdGE6IGFueSkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4+KClcbmNvbnN0IHBydW5lTWFwID0gbmV3IE1hcDxzdHJpbmcsIChkYXRhOiBhbnkpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+PigpXG5jb25zdCBkYXRhTWFwID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKVxuY29uc3QgY3VzdG9tTGlzdGVuZXJzTWFwOiBDdXN0b21MaXN0ZW5lcnNNYXAgPSBuZXcgTWFwKClcbmNvbnN0IGN0eFRvTGlzdGVuZXJzTWFwID0gbmV3IE1hcDxzdHJpbmcsIEN1c3RvbUxpc3RlbmVyc01hcD4oKVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSG90Q29udGV4dChvd25lclBhdGg6IHN0cmluZyk6IFZpdGVIb3RDb250ZXh0IHtcbiAgaWYgKCFkYXRhTWFwLmhhcyhvd25lclBhdGgpKSB7XG4gICAgZGF0YU1hcC5zZXQob3duZXJQYXRoLCB7fSlcbiAgfVxuXG4gIC8vIHdoZW4gYSBmaWxlIGlzIGhvdCB1cGRhdGVkLCBhIG5ldyBjb250ZXh0IGlzIGNyZWF0ZWRcbiAgLy8gY2xlYXIgaXRzIHN0YWxlIGNhbGxiYWNrc1xuICBjb25zdCBtb2QgPSBob3RNb2R1bGVzTWFwLmdldChvd25lclBhdGgpXG4gIGlmIChtb2QpIHtcbiAgICBtb2QuY2FsbGJhY2tzID0gW11cbiAgfVxuXG4gIC8vIGNsZWFyIHN0YWxlIGN1c3RvbSBldmVudCBsaXN0ZW5lcnNcbiAgY29uc3Qgc3RhbGVMaXN0ZW5lcnMgPSBjdHhUb0xpc3RlbmVyc01hcC5nZXQob3duZXJQYXRoKVxuICBpZiAoc3RhbGVMaXN0ZW5lcnMpIHtcbiAgICBmb3IgKGNvbnN0IFtldmVudCwgc3RhbGVGbnNdIG9mIHN0YWxlTGlzdGVuZXJzKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSBjdXN0b21MaXN0ZW5lcnNNYXAuZ2V0KGV2ZW50KVxuICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICBjdXN0b21MaXN0ZW5lcnNNYXAuc2V0KFxuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIGxpc3RlbmVycy5maWx0ZXIoKGwpID0+ICFzdGFsZUZucy5pbmNsdWRlcyhsKSlcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5ld0xpc3RlbmVyczogQ3VzdG9tTGlzdGVuZXJzTWFwID0gbmV3IE1hcCgpXG4gIGN0eFRvTGlzdGVuZXJzTWFwLnNldChvd25lclBhdGgsIG5ld0xpc3RlbmVycylcblxuICBmdW5jdGlvbiBhY2NlcHREZXBzKGRlcHM6IHN0cmluZ1tdLCBjYWxsYmFjazogSG90Q2FsbGJhY2tbJ2ZuJ10gPSAoKSA9PiB7fSkge1xuICAgIGNvbnN0IG1vZDogSG90TW9kdWxlID0gaG90TW9kdWxlc01hcC5nZXQob3duZXJQYXRoKSB8fCB7XG4gICAgICBpZDogb3duZXJQYXRoLFxuICAgICAgY2FsbGJhY2tzOiBbXVxuICAgIH1cbiAgICBtb2QuY2FsbGJhY2tzLnB1c2goe1xuICAgICAgZGVwcyxcbiAgICAgIGZuOiBjYWxsYmFja1xuICAgIH0pXG4gICAgaG90TW9kdWxlc01hcC5zZXQob3duZXJQYXRoLCBtb2QpXG4gIH1cblxuICBjb25zdCBob3Q6IFZpdGVIb3RDb250ZXh0ID0ge1xuICAgIGdldCBkYXRhKCkge1xuICAgICAgcmV0dXJuIGRhdGFNYXAuZ2V0KG93bmVyUGF0aClcbiAgICB9LFxuXG4gICAgYWNjZXB0KGRlcHM/OiBhbnksIGNhbGxiYWNrPzogYW55KSB7XG4gICAgICBpZiAodHlwZW9mIGRlcHMgPT09ICdmdW5jdGlvbicgfHwgIWRlcHMpIHtcbiAgICAgICAgLy8gc2VsZi1hY2NlcHQ6IGhvdC5hY2NlcHQoKCkgPT4ge30pXG4gICAgICAgIGFjY2VwdERlcHMoW293bmVyUGF0aF0sIChbbW9kXSkgPT4gZGVwcyAmJiBkZXBzKG1vZCkpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXBzID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBleHBsaWNpdCBkZXBzXG4gICAgICAgIGFjY2VwdERlcHMoW2RlcHNdLCAoW21vZF0pID0+IGNhbGxiYWNrICYmIGNhbGxiYWNrKG1vZCkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGVwcykpIHtcbiAgICAgICAgYWNjZXB0RGVwcyhkZXBzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBob3QuYWNjZXB0KCkgdXNhZ2UuYClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gZXhwb3J0IG5hbWVzIChmaXJzdCBhcmcpIGFyZSBpcnJlbGV2YW50IG9uIHRoZSBjbGllbnQgc2lkZSwgdGhleSdyZVxuICAgIC8vIGV4dHJhY3RlZCBpbiB0aGUgc2VydmVyIGZvciBwcm9wYWdhdGlvblxuICAgIGFjY2VwdEV4cG9ydHMoXzogc3RyaW5nIHwgcmVhZG9ubHkgc3RyaW5nW10sIGNhbGxiYWNrPzogYW55KSB7XG4gICAgICBhY2NlcHREZXBzKFtvd25lclBhdGhdLCBjYWxsYmFjayAmJiAoKFttb2RdKSA9PiBjYWxsYmFjayhtb2QpKSlcbiAgICB9LFxuXG4gICAgZGlzcG9zZShjYikge1xuICAgICAgZGlzcG9zZU1hcC5zZXQob3duZXJQYXRoLCBjYilcbiAgICB9LFxuXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB1bnR5cGVkXG4gICAgcHJ1bmUoY2I6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcbiAgICAgIHBydW5lTWFwLnNldChvd25lclBhdGgsIGNiKVxuICAgIH0sXG5cbiAgICAvLyBUT0RPXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxuICAgIGRlY2xpbmUoKSB7fSxcblxuICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAvLyBUT0RPIHNob3VsZCB0ZWxsIHRoZSBzZXJ2ZXIgdG8gcmUtcGVyZm9ybSBobXIgcHJvcGFnYXRpb25cbiAgICAgIC8vIGZyb20gdGhpcyBtb2R1bGUgYXMgcm9vdFxuICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICB9LFxuXG4gICAgLy8gY3VzdG9tIGV2ZW50c1xuICAgIG9uKGV2ZW50LCBjYikge1xuICAgICAgY29uc3QgYWRkVG9NYXAgPSAobWFwOiBNYXA8c3RyaW5nLCBhbnlbXT4pID0+IHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBtYXAuZ2V0KGV2ZW50KSB8fCBbXVxuICAgICAgICBleGlzdGluZy5wdXNoKGNiKVxuICAgICAgICBtYXAuc2V0KGV2ZW50LCBleGlzdGluZylcbiAgICAgIH1cbiAgICAgIGFkZFRvTWFwKGN1c3RvbUxpc3RlbmVyc01hcClcbiAgICAgIGFkZFRvTWFwKG5ld0xpc3RlbmVycylcbiAgICB9LFxuXG4gICAgc2VuZChldmVudCwgZGF0YSkge1xuICAgICAgbWVzc2FnZUJ1ZmZlci5wdXNoKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2N1c3RvbScsIGV2ZW50LCBkYXRhIH0pKVxuICAgICAgc2VuZE1lc3NhZ2VCdWZmZXIoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBob3Rcbn1cblxuLyoqXG4gKiB1cmxzIGhlcmUgYXJlIGR5bmFtaWMgaW1wb3J0KCkgdXJscyB0aGF0IGNvdWxkbid0IGJlIHN0YXRpY2FsbHkgYW5hbHl6ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFF1ZXJ5KHVybDogc3RyaW5nLCBxdWVyeVRvSW5qZWN0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBza2lwIHVybHMgdGhhdCB3b24ndCBiZSBoYW5kbGVkIGJ5IHZpdGVcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aCgnLicpICYmICF1cmwuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIHVybFxuICB9XG5cbiAgLy8gY2FuJ3QgdXNlIHBhdGhuYW1lIGZyb20gVVJMIHNpbmNlIGl0IG1heSBiZSByZWxhdGl2ZSBsaWtlIC4uL1xuICBjb25zdCBwYXRobmFtZSA9IHVybC5yZXBsYWNlKC8jLiokLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxuICBjb25zdCB7IHNlYXJjaCwgaGFzaCB9ID0gbmV3IFVSTCh1cmwsICdodHRwOi8vdml0ZWpzLmRldicpXG5cbiAgcmV0dXJuIGAke3BhdGhuYW1lfT8ke3F1ZXJ5VG9JbmplY3R9JHtzZWFyY2ggPyBgJmAgKyBzZWFyY2guc2xpY2UoMSkgOiAnJ30ke1xuICAgIGhhc2ggfHwgJydcbiAgfWBcbn1cblxuZXhwb3J0IHsgRXJyb3JPdmVybGF5IH1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU0sUUFBUSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBOEd6QixDQUFBO0FBRUQsTUFBTSxNQUFNLEdBQUcsZ0NBQWdDLENBQUE7QUFDL0MsTUFBTSxXQUFXLEdBQUcsMENBQTBDLENBQUE7QUFFOUQ7QUFDQTtBQUNBLE1BQU0sRUFBRSxXQUFXLEdBQUcsTUFBQTtDQUF5QyxFQUFFLEdBQUcsVUFBVSxDQUFBO0FBQ3hFLE1BQU8sWUFBYSxTQUFRLFdBQVcsQ0FBQTtBQUczQyxJQUFBLFdBQUEsQ0FBWSxHQUF3QixFQUFBOztBQUNsQyxRQUFBLEtBQUssRUFBRSxDQUFBO0FBQ1AsUUFBQSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUMvQyxRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUU5QixRQUFBLFdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ3pCLFFBQUEsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN6RCxNQUFNLE9BQU8sR0FBRyxRQUFRO2NBQ3BCLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7QUFDdEMsY0FBRSxHQUFHLENBQUMsT0FBTyxDQUFBO1FBQ2YsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2QsSUFB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