import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	transpilePackages: [
		"@cossistant/api",
		"@cossistant/location",
		"@cossistant/transactional",
	],
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default withMDX(nextConfig);
