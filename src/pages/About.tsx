import { useLoaderData } from "react-router";

type LoaderData = {
  message: string;
  timestamp: number;
};

// Data loader function for the About page
export async function loader(): Promise<LoaderData> {
  // Simulate some async data fetching
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    message: "About this Tauri + React Router application",
    timestamp: Date.now(),
  };
}

export default function About() {
  const data = useLoaderData() as LoaderData;

  return (
    <div style={{ padding: "20px" }}>
      <h1>About</h1>
      <p>{data.message}</p>
      <p>Page loaded at: {new Date(data.timestamp).toLocaleString()}</p>
    </div>
  );
}