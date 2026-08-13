import type { IconProps } from "@phosphor-icons/react";
import type { SectionType } from "@rbuilder/schema/resume/data";
import { t } from "@lingui/core/macro";
import {
	AddressBookIcon,
	BookOpenIcon,
	BriefcaseIcon,
	CameraIcon,
	CodeSimpleIcon,
	DownloadSimpleIcon,
	FileCodeIcon,
	FileTextIcon,
	GlobeHemisphereWestIcon,
	GraduationCapIcon,
	HandHeartIcon,
	HeartbeatIcon,
	IdentificationCardIcon,
	InfoIcon,
	LayoutIcon,
	LightningIcon,
	MedalIcon,
	NotePencilIcon,
	PaletteIcon,
	PuzzlePieceIcon,
	RowsIcon,
	ScrollIcon,
	ShareIcon,
	ShareNetworkIcon,
	SparkleIcon,
	StampIcon,
	TextTIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { match } from "ts-pattern";
import { cn } from "@rbuilder/utils/style";

export { defaultSectionIconNames } from "@rbuilder/schema/resume/section-icons";

export type LeftSidebarSection = "picture" | "basics" | "summary" | SectionType | "custom";

// CustomSectionType values that are not in SectionType (used in custom sections only)
type CustomOnlyType = "cover-letter";

export type RightSidebarSection =
	| "template"
	| "layout"
	| "typography"
	| "design"
	| "styles"
	| "page"
	| "notes"
	| "sharing"
	| "statistics"
	| "analysis"
	| "export"
	| "information";

export type SidebarSection = LeftSidebarSection | RightSidebarSection;

export const leftSidebarSections: LeftSidebarSection[] = [
	"picture",
	"basics",
	"summary",
	"profiles",
	"experience",
	"education",
	"projects",
	"skills",
	"languages",
	"interests",
	"awards",
	"certifications",
	"publications",
	"volunteer",
	"references",
	"custom",
] as const;

export const rightSidebarSections: RightSidebarSection[] = [
	"template",
	"layout",
	"sharing",
	"statistics",
	"typography",
	"design",
	"styles",
	"page",
	"notes",
	"export",
] as const;

export const getSectionTitle = (type: SidebarSection | CustomOnlyType): string => {
	return (
		match(type)
			// Left Sidebar Sections
			.with("picture", () => t`Picture`)
			.with("basics", () => t`Basics`)
			.with("summary", () => t`Summary`)
			.with("profiles", () => t`Profiles`)
			.with("experience", () => t`Experience`)
			.with("education", () => t`Education`)
			.with("projects", () => t`Projects`)
			.with("skills", () => t`Skills`)
			.with("languages", () => t`Languages`)
			.with("interests", () => t`Interests`)
			.with("awards", () => t`Awards`)
			.with("certifications", () => t`Certifications`)
			.with("publications", () => t`Publications`)
			.with("volunteer", () => t`Volunteer`)
			.with("references", () => t`References`)
			.with("custom", () => t`Custom Sections`)

			// Custom Section Types (not in main sidebar)
			.with("cover-letter", () => t`Cover Letter`)

			// Right Sidebar Sections
			.with("template", () => t`Template`)
			.with("layout", () => t`Layout`)
			.with("typography", () => t`Typography`)
			.with("design", () => t`Design`)
			.with("styles", () => t`Custom Styles`)
			.with("page", () => t`Page`)
			.with("notes", () => t`Notes`)
			.with("sharing", () => t`Sharing`)
			.with("statistics", () => t`Statistics`)
			.with("analysis", () => t`Resume Analysis`)
			.with("export", () => t`Export`)
			.with("information", () => t`Information`)

			.exhaustive()
	);
};

export const getSectionIcon = (type: SidebarSection | CustomOnlyType, props?: IconProps): React.ReactNode => {
	const iconProps = { ...props, className: cn("shrink-0", props?.className) };

	return (
		match(type)
			// Left Sidebar Sections
			.with("picture", () => <CameraIcon {...iconProps} />)
			.with("basics", () => <IdentificationCardIcon {...iconProps} />)
			.with("summary", () => <ScrollIcon {...iconProps} />)
			.with("profiles", () => <ShareNetworkIcon {...iconProps} />)
			.with("experience", () => <BriefcaseIcon {...iconProps} />)
			.with("education", () => <GraduationCapIcon {...iconProps} />)
			.with("projects", () => <CodeSimpleIcon {...iconProps} />)
			.with("skills", () => <LightningIcon {...iconProps} />)
			.with("languages", () => <GlobeHemisphereWestIcon {...iconProps} />)
			.with("interests", () => <HeartbeatIcon {...iconProps} />)
			.with("awards", () => <MedalIcon {...iconProps} />)
			.with("certifications", () => <StampIcon {...iconProps} />)
			.with("publications", () => <BookOpenIcon {...iconProps} />)
			.with("volunteer", () => <HandHeartIcon {...iconProps} />)
			.with("references", () => <AddressBookIcon {...iconProps} />)
			.with("custom", () => <PuzzlePieceIcon {...iconProps} />)

			// Custom Section Types (not in main sidebar)
			.with("cover-letter", () => <FileTextIcon {...iconProps} />)

			// Right Sidebar Sections
			.with("template", () => <LayoutIcon {...iconProps} />)
			.with("layout", () => <RowsIcon {...iconProps} />)
			.with("typography", () => <TextTIcon {...iconProps} />)
			.with("design", () => <PaletteIcon {...iconProps} />)
			.with("styles", () => <FileCodeIcon {...iconProps} />)
			.with("page", () => <FileTextIcon {...iconProps} />)
			.with("notes", () => <NotePencilIcon {...iconProps} />)
			.with("sharing", () => <ShareIcon {...iconProps} />)
			.with("statistics", () => <TrendUpIcon {...iconProps} />)
			.with("analysis", () => <SparkleIcon {...iconProps} />)
			.with("export", () => <DownloadSimpleIcon {...iconProps} />)
			.with("information", () => <InfoIcon {...iconProps} />)

			.exhaustive()
	);
};
