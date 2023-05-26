import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: {
      id: params.jokeId,
    },
  });

  if (!joke) {
    throw new Response("Joke not found.", {
      status: 404,
    });
  }
  return json({
    joke,
  });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    <div className="error-container">
      Joke not found with given id "${jokeId}"
    </div>;
  }

  return (
    <div className="error-container">
      There was an error loading joke with id "${jokeId}", sorry.
    </div>
  );
}
