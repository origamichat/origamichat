// Re-export everything from the React package
export * from "@repo/react";

// Next.js specific exports
export { ServerSupport } from "./components/ServerSupport";
export { SupportWidget } from "./components/SupportWidget";
export { withOrigamiChat } from "./hoc/withOrigamiChat";

// Next.js utilities
export { getServerSideProps } from "./utils/getServerSideProps";
export { generateMetadata } from "./utils/generateMetadata";
