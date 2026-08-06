import { Trans } from "@lingui/react/macro";
import { PaletteIcon } from "@phosphor-icons/react";
import { CommandItem } from "@reactive-resume/ui/components/command";
import { useCommandPaletteStore } from "../../store";
import { BaseCommandGroup } from "../base";
import { ThemeCommandPage } from "./theme";

export function PreferencesCommandGroup() {
	const pushPage = useCommandPaletteStore((state) => state.pushPage);

	return (
		<>
			<BaseCommandGroup heading={<Trans>Preferences</Trans>}>
				<CommandItem onSelect={() => pushPage("theme")}>
					<PaletteIcon />
					<Trans>Change theme to…</Trans>
				</CommandItem>
			</BaseCommandGroup>

			<ThemeCommandPage />
		</>
	);
}
