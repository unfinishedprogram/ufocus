import { Profile } from "./types";

export default class ProfileManager {
    $profiles: Profile[] = [];

    $container_elm: HTMLElement = document.createElement("div");
    $profile_list: HTMLElement = document.createElement("div");
    $selected_profile: Profile | undefined = undefined;

    constructor() {
        this.$container_elm.setAttribute("id", "profile_manager");
        this.$profile_list.setAttribute("id", "profile_list");
        this.$container_elm.appendChild(this.$profile_list);
        this.load_profiles();
        chrome.storage.local.get("selected_profile")
            .then(profile => {
                this.$selected_profile = profile.selected_profile as Profile
                this.render_profile_list(this.$profiles);
            });
    }

    async load_profiles() {
        const profiles = await chrome.storage.local.get("profiles");
        this.$profiles = profiles["profiles"] || [];
        if (this.$profiles.length == 0) {
            const default_profile = {
                name: "Default",
                persona: "A normal person, trying to avoid time-wasting activities",
                uuid: crypto.randomUUID(),
            };
            this.$profiles = [
                default_profile
            ];

            await chrome.storage.local.set({ profiles: this.$profiles });

            this.select_profile(default_profile)
        }
        this.render_profile_list(this.$profiles);
    }

    render_profile_list(profiles: Profile[]): HTMLElement {
        this.$profile_list.innerHTML = "";

        for (let profile of profiles) {
            this.$profile_list.appendChild(this.render_profile(profile));
        }
        // Add a create button
        let create_button = document.createElement("button");
        create_button.innerText = "Add New";
        create_button.addEventListener("click", () => {
            this.$profile_list.appendChild(this.create_new_profile());
        });
        this.$profile_list.appendChild(create_button);
        return this.$profile_list;
    }

    async select_profile(profile: Profile) {
        await chrome.storage.local.set({ selected_profile: profile });

        console.log("Set selected_profile", profile);

        await chrome.storage.local.set({ selected_profile: profile });
        document.querySelector("#current_profile")!.innerHTML = profile.name;
        this.$selected_profile = profile;
        this.render_profile_list(this.$profiles)
    }

    render_profile(profile: Profile): HTMLElement {
        let profile_elm = document.createElement("div");
        profile_elm.classList.add("profile");

        if (this.$selected_profile?.name == profile.name) {
            profile_elm.classList.add("selected")
        }

        let profile_name = document.createElement("div");
        profile_name.classList.add("profile_name");
        profile_name.innerText = profile.name;

        let profile_persona = document.createElement("div");
        profile_persona.classList.add("profile_persona");
        profile_persona.innerText = profile.persona;

        profile_elm.addEventListener("click", () => this.select_profile(profile));

        // // Delete button
        // let delete_button = document.createElement("button");
        // delete_button.innerText = "Delete";
        // delete_button.addEventListener("click", () => {
        //     this.remove_profile(profile);
        //     this.load_profiles();
        // });

        profile_elm.appendChild(profile_name);
        profile_elm.appendChild(profile_persona);

        return profile_elm;
    }

    // Allows editing all fields using input elements
    edit_profile(profile: Profile): HTMLElement {
        let profile_elm = document.createElement("div");
        profile_elm.classList.add("profile");

        let profile_name = document.createElement("input");
        profile_name.classList.add("profile_name");
        profile_name.value = profile.name;

        let profile_persona = document.createElement("input");
        profile_persona.classList.add("profile_persona");
        profile_persona.value = profile.persona;

        let save_button = document.createElement("button");
        save_button.innerText = "Save";

        save_button.addEventListener("click", () => {
            profile.name = profile_name.value;
            profile.persona = profile_persona.value;
            this.save_profiles();
            this.$container_elm.innerHTML = "";
            this.$container_elm.appendChild(this.render_profile_list(this.$profiles));
        });

        profile_elm.appendChild(profile_name);
        profile_elm.appendChild(profile_persona);
        profile_elm.appendChild(save_button);

        return profile_elm;
    }

    create_new_profile(): HTMLElement {
        let profile_elm = document.createElement("div");
        profile_elm.classList.add("profile");

        let profile_name = document.createElement("input");
        profile_name.classList.add("profile_name");
        profile_name.value = "New Profile";

        let profile_persona = document.createElement("input");
        profile_persona.classList.add("profile_persona");
        profile_persona.value = "New Persona";

        let save_button = document.createElement("button");
        save_button.innerText = "Save";

        save_button.addEventListener("click", () => {
            let profile = {
                name: profile_name.value,
                persona: profile_persona.value,
                uuid: crypto.randomUUID(),
            }
            this.add_profile(profile);
            this.$container_elm.innerHTML = "";
            this.$container_elm.appendChild(this.render_profile_list(this.$profiles));
        });

        profile_elm.appendChild(profile_name);
        profile_elm.appendChild(profile_persona);
        profile_elm.appendChild(save_button);

        return profile_elm;
    }

    async save_profiles() {
        await chrome.storage.local.set({ profiles: this.$profiles });
    }

    add_profile(profile: Profile) {
        this.$profiles.push(profile);
        this.save_profiles();
    }

    remove_profile(profile: Profile) {
        this.$profiles = this.$profiles.filter(p => p.uuid != profile.uuid);
        this.save_profiles();
    }
}