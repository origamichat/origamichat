import { loader } from "fumadocs-core/source";
import { docs } from "@/docs-source/index";

export const source = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
});
