import { Profile } from "./types";

export default class ProfileManager {
    $profiles: Profile[] = [];

    $container_elm: HTMLElement = document.createElement("div");
    $profile_list: HTMLElement = document.createElement("div");

    constructor() {
        this.$container_elm.setAttribute("id", "profile_manager");
        this.$profile_list.setAttribute("id", "profile_list");
        this.$container_elm.appendChild(this.$profile_list);
        this.load_profiles();
    }

    async load_profiles() {
        const profiles = await chrome.storage.local.get("profiles");
        this.$profiles = profiles["profiles"] || [];
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
    }

    render_profile(profile: Profile): HTMLElement {
        let profile_elm = document.createElement("div");
        profile_elm.classList.add("profile");

        let profile_name = document.createElement("div");
        profile_name.classList.add("profile_name");
        profile_name.innerText = profile.name;

        let profile_persona = document.createElement("div");
        profile_persona.classList.add("profile_persona");
        profile_persona.innerText = profile.persona;

        let profile_topics = document.createElement("div");
        profile_topics.classList.add("profile_topics");
        profile_topics.innerText = profile.whitelisted_topics.join(", ");

        // Button to select this profile
        let select_button = document.createElement("button");
        select_button.innerText = "Select";
        select_button.addEventListener("click", () => this.select_profile(profile));

        // Button to edit this profile
        let edit_button = document.createElement("button");
        edit_button.innerText = "Edit";
        edit_button.addEventListener("click", () => {
            profile_elm.innerHTML = "";
            profile_elm.appendChild(this.edit_profile(profile));
        });

        // Delete button
        let delete_button = document.createElement("button");
        delete_button.innerText = "Delete";
        delete_button.addEventListener("click", () => {
            this.remove_profile(profile);
            this.load_profiles();
        });

        profile_elm.appendChild(profile_name);
        profile_elm.appendChild(profile_persona);
        profile_elm.appendChild(profile_topics);
        profile_elm.appendChild(select_button);
        profile_elm.appendChild(edit_button);
        profile_elm.appendChild(delete_button);

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

        let profile_topics = document.createElement("input");
        profile_topics.classList.add("profile_topics");
        profile_topics.value = profile.whitelisted_topics.join(", ");

        let save_button = document.createElement("button");
        save_button.innerText = "Save";

        save_button.addEventListener("click", () => {
            profile.name = profile_name.value;
            profile.persona = profile_persona.value;
            profile.whitelisted_topics = profile_topics.value.split(",").map(s => s.trim());
            this.save_profiles();
            this.$container_elm.innerHTML = "";
            this.$container_elm.appendChild(this.render_profile_list(this.$profiles));
        });

        profile_elm.appendChild(profile_name);
        profile_elm.appendChild(profile_persona);
        profile_elm.appendChild(profile_topics);
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

        let profile_topics = document.createElement("input");
        profile_topics.classList.add("profile_topics");
        profile_topics.value = "New Topic";

        let save_button = document.createElement("button");
        save_button.innerText = "Save";

        save_button.addEventListener("click", () => {
            let profile = {
                name: profile_name.value,
                persona: profile_persona.value,
                whitelisted_topics: profile_topics.value.split(",").map(s => s.trim()),
                blacklisted_topics: [],
                uuid: crypto.randomUUID(),
            }
            this.add_profile(profile);
            this.$container_elm.innerHTML = "";
            this.$container_elm.appendChild(this.render_profile_list(this.$profiles));
        });

        profile_elm.appendChild(profile_name);
        profile_elm.appendChild(profile_persona);
        profile_elm.appendChild(profile_topics);
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