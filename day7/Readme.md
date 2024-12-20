### What's new in React19

[React19](https://ko.react.dev/blog/2024/04/25/react-19)

#### Actions

A common use case in React apps is to perform a data mutation and then update state in response. For example when a user submit a form to change their name, you will make an API request, and then handle the response. In the past, you would need to handle pending states, error, optimistic updates, and sequential requests manually.

For example, you could handle the pending and error state in useState:

```js
// Before Actions

function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

In React 19, we're adding support for using async functions in transitions to handle pending states, errors, forms, and optimistic updates automatically.

For example, you can use `useTransition` to handle the pending state for you

```js
// using pending state from Actions

function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);

      if (error) {
        setError(error);
        return;
      }

      redirect("/path");
    });
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

The async transition will immediately set the `isPending` state to true, make the async request(s), and switch `isPending` to false after any transitions.

This allows you to keep the current UI responsive and interactive while the data is changing.

### Important!

> By convention, functions that use async transitions are called "Actions".

> Actions automatically manage submitting data for you:

> - Pending state: Actions provide a pending state that starts at the beginning of a request and automatically resets when the final state update is committed.

> - Optimistic updates: Actions support the new `useOptimistic` hook so you can show users instant feedback while the requests are submitting.

> - Error handling: Actions provide error handling so you can display Error Boundaries when a request fails, and revert optimistic updates to their original value automatically.

> - Forms: `<form>` elements now support passing functions to the `action` and `formAction` props. Passing functions to the action props use Actions by default and reset the form automatically after submission.

Building on top of Actions, React 19 introduces `useOptimistic` to manage optimistic updates, and a new hook `React.useActionState` to handle common cases for Actions. In `react-dom` we're adding `<form> Actions` to manage forms automatically and `useFormStatus` to support the common cases for Actions in forms.

In React 19, the above example can be simplified to:

```js
// Using <form> Actions and useActionState

function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));

      if (error) {
        return error;
      }

      redirect("/path");
      return null;
    },
    null
  );

  return (
    <form action={submitAction}>
      <input type="text" name="input" />
      <button type="submit" disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

In the next section, we'll break down each of the new Action features in React 19.

### New hook: useActionState

To make the common cases easier for Actions, we've added a new hook called useActionState:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);

    if (error) {
      // You can return any result of the action.
      // Here, we return only the error.

      return error;
    }

    // handle success
    return null;
  },
  null
);
```

`useActionState` accepts a function (the "Action"), and returns a wrapped Action to call. This works because Actions compose. When the wrapped Action is called, `useActionState` will return the last result of Action as `data`, and the pending state of the Action as `pending`.

#### Important!

`React.useActionState` was previously called `ReactDOM.useFormState` in the Canary releases, but we've renamed it and deprecated `useFormState`.

For more information, see the docs for `useActionState`.

### ReactDOM: `<form>` Actions

Actions are also integrated with React 19's new `<form>` features for `react-dom`. We've added support for passing functions as the action and formAction props of `<form>`, `<input>` and `<button>` elements to automatically submit forms with Actions.

```js
<form action={actionFunction}>
```

when a `<form>` Action succeeds, React will automatically reset the form for uncontrolled components. If you need to reset the `<form>` manually, you can call `requestFormReset` React DOM API.

For more information, see the `react-dom` docs for `<form>`, `<input>` and `<button>`.

### React DOM: New hook: `useFormState`

In design systems, it's common to write design components that need access to information about the `<form>` they're in, without drilling props down to the component. This can be done via Context, but to make the common case easier, we've added a new hook `useFormStatus`:

```js
import { useFormStatus } from "react-dom";

function DesignButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} />;
}
```

`useFormStatus` reads the status of the parent `<form>` as if the form was a Context Provider.

For more information, see the react-dom docs for [useFormState](https://ko.react.dev/reference/react-dom/hooks/useFormStatus)

### New hook: useOptimistic

Another common UI pattern when performing a data mutation is to show the final state optimistically while the async request is underway. In React 19, we're adding a new hook called `useOptimistic` to maker this easier.

```js
function ChangeName({ currentName, onUpdateName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async (formData) => {
    const newName = formData.get("name");
    setOptimisticName(newName);

    const updatedName = await updateName(newName);
    onUpdateName(updateName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name: </label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

The `useOptimistic` hook will immediately render the `optimisticName` while the `updateName` request is in progress. When the update finishes or errors, React will automatically switch back to the `current` value.

for more information, see the docs for [useOptimistic].(https://ko.react.dev/reference/react/useOptimistic)

### New API : `use`

In React 19 we're introducing a new API to read resources in render: `use`.

For example, you can read a promise with `use`, and React will Suspend until the promise resolves.

```js
import { use } from "react";

function Comments({ commentsPromise }) {
  // 'use' will suspend until the promise resolves.
  const comments = use(commentPromise);

  return comments.map((comment) => <p key={comment.id}>{comment}</p>);
}

function Page({ commentsPromise }) {
  // When 'use' suspends in Comments,
  // this Suspense boundary will be shown.

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}
```

### important!

<b>`use` dose not support promises created in render.</b>

> if you try to pass a promise created in render to `use`, React will warn.

```
A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.
```

> To fix, you need to pass a promise from a suspense powered library or framework that supports caching for promises. In the future we plan to ship features to make it easier to cache promises in render.

You can also read context with `use`, allowing you to read Context conditionally such as after early returns.

```js
import { use } from "react";
import ThemeContext from "./ThemeContext";

function Heading({ children }) {
  if (children === null) {
    return null;
  }

  // This would not work with useContext
  // because of the early return.

  const theme = use(ThemeContext);
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
```

The `use` API can only be called in render, similar to hooks. Unlike hooks, use can be called conditionally. In the future we plan to support more ways to consume resources in render with `use`.

For more information, see the docs for [use](https://ko.react.dev/reference/react/use).

## React Server Components

### Server Components

Server Components are a new option that allows rendering components ahead of time, before bundling, in an environment separate form you client application or SSR server. This separate environment is the "server" in React Server Components. Server Components can run once at build time on your CI server, or they can be run for each request using a wab server.

React 19 includes all of the React Server Components features included from the Canary channel. This means libraries that ship with Server Components can now target React 19 as a peer dependency with a react-server export condition for use in frameworks that support the [Full-stack React Architecture](https://ko.react.dev/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).

### important!

<b>How do I build support for Server Components?</b>

While React Server Components in React 19 are stable and will not break between major versions, the underlying APIs used to implement a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.

for more, see the docs for [React Server Components](https://ko.react.dev/reference/rsc/server-components).

### Server Actions

Server Actions allow Client Components to call async functions executed on the server.

When a Server Action is defined with the "use server" directive, your framework will automatically create a reference to th server function, and pass that reference to the Client Component.

When that function is called on th client, React will send a request to the server to execute the function, and return the result.

### important!

<b>There is no directive for Server Components.</b>

A common misunderstanding is that Server Components are denoted by "use server", but there is no directive for Server Components. The "use server" directive is used for Server Actions.

For more info, see the docs for [Directives](https://ko.react.dev/reference/rsc/directives).

Server Actions can be created in Server Components and passed as props to Client Components, or the can be imported and used in Client Components.

### Improvements in React 19

<b>`ref` as Prop</b>

Starting in React 19, you can now access ref as a prop for function components:

```js
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}

// ...
<MyInput ref={ref} />;
```

New function components will no longer need `forwardRef`, and we will be publishing a codemod to automatically update your components to use the new `ref` prop. In future version we will deprecate and remove `forwardRef`.

### important!

`refs` passed to classes are not passed not as props since they reference the component instance.

### Diffs for hydrate errors

We also improved error reporting for hydration errors in `react-dom`.
For example, instead of logging multiple errors in DEV without any information about the mismatch:

### `<Context>` as a provider

In React 19, you can render `<Context>` as a provider instead of `<Context.Provider>`:

```js
const ThemeContext = createContext("");

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

New Context provers can use `<Context>` and we will be publishing a codemod to convert existing providers. In future versions we will deprecate `<Context.Provider>`.

### Cleanup functions for refs

We now support returning a cleanup function from `ref` callbacks.

```js
<input
  ref={(ref) => {
    // ref created

    // New: return a cleanup function to reset
    // the ref when element is removed from DOM

    return () => {
        //ref cleanup
    };
  }
/>
```

When the component unmounts, React will call the cleanup function returned from the ref callback. This works for DOM refs, refs to class components, and `useImperativeHandle`.

### important!

Previously, React would call `ref` functions with null when unmounting the component. If your ref returns a cleanup function, React will now skip this step.

In future versions, we will deprecate calling refs with `null` when unmounting components.

Due to the introducing of ref cleanup functions, returning anything else from a `ref` callback will now be rejected by Typescript. The fix is usually to stop using implicit returns, for example:

```md
"-" <div ref={current => (instance = current)} />

"+" <div ref={current => { instance = current }} />
```

The original code returned the instance of the `HTMLDivElement` and TypeScript wouldn't know if this was supposed to be a cleanup function of if you didn't want to return a cleanup function.

You can codemod this pattern with no-implicit-ref-callback-return.

### `useDeferredValue` initial value

We've added in `initialValue` option to `useDeferredValue`:

```js
function Search({ deferredValue }) {
  // On initial render the value is "".
  // Then a re-render is scheduled with the deferredValue.

  const value = useDeferredValue(deferredValue, "");

  return <Results query={value} />;
}
```

When initialValue is provided, `useDeferredValue` will return it as `value` for the initial render of the component, and schedules a re-render in the background with the deferredValue returned.

For more, see [useDeferredValue](https://ko.react.dev/reference/react/useDeferredValue).

### Support for Document Metadata

In HTML, document metadata tags like `<title>`, `<link>`, and `<meta>` are reserved for placement in the `<head>` section of document.
In React, the component that decides what metadata is appropriate for the app may be very far from the place where you render the `<head>` or React does not render the `<head>` at all.
In the past, these elements would need to be inserted manually in an effect, or by libraries like [react-helmet](https://github.com/nfl/react-helmet), and required careful handling when server rendering a React application.

In React19, we're adding support for rendering document metadata tags in components natively:

```js
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={posts.keywords} />
      <p>Eee equals em-see-squared...</p>
    </article>
  );
}
```

When React renders this component, it will see the `<title>`, `<link>` and `<meta>` tags, and automatically hoist them to the `<head>` section of document. By supporting these metadata tags natively, we're able to ensure they work with client-only apps, streaming SSR, and Server Components.

### important!

<b>You may still want a Metadata library</b>

For simple use cases, rendering Document Metadata as tags may be suitable, but libraries can offer more powerful features like overriding generic metadata with specific metadata based on the current route. These features make it easier for frameworks and libraries like 'react-helmet' to support metadata tags, rather than replace them.

### Support for stylesheets

Stylesheets, both externally linked (`<link rel=""stylesheet" href="...">`) and inline (`<style> ... </style>`), require careful positioning in the DOM due to style precedence rules. Building a stylesheet capability that allows for composability within components is hard, so users often end up either loading all of their styles far from the components that may depend on them, or they use a style library which encapsulates this complexity.

In React 19, we're addressing this complexity and providing event deeper integration into Concurrent Rendering on the Client and Streaming Rendering on the Server with built in support for stylesheets.

If you tell React the `precedence` of your stylesheet it will manage the insertion order of the stylesheet in the DOM and ensure that the stylesheet (if external) is loaded before revealing content that depends on those style rules.

```js
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
       <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  );
}


function ComponentTwo () {
    return <div>
        <p>{...}</p>
        <link rel="stylesheet" href="baz" precedence="default" /> // <-- will be inserted between foo & bar
    </div>
}

```

During Server Side Rendering React will include the stylesheet in the `<head>`, which ensures that the browser will not paint until has loaded. If the stylesheet is discovered late after we've already started streaming, React will ensure that the stylesheet is inserted into the `<head>` on the client before revealing the content of a Suspense boundary that depends on that stylesheet.

During Client Side Rendering React will wait for newly rendered stylesheets to load before committing the render. If you render this component from multiple places within your application React will only include the stylesheet once in the document.
