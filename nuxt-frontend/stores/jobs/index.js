import { defineStore } from "pinia";
import axios from "axios";
import config from "@/config.js";

export const useJobListStore = defineStore("job-list", {
  state: () => {
    return {
      items: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async loadJobs() {
      // No need of API call if items are already loaded
      if (this.items != null && this.error == null) {
        this.isLoading = false;
        return;
      }

      return new Promise((resolve) => {
        this.isLoading = true;
        this.error = null;

        axios
          .get(config.API_BASE + "/api/careers")
          .then((response) => {
            this.items = this.mapJobIcons(response.data);
            this.isLoading = false;
            resolve();
          })
          .catch((error) => {
            this.error = error;
            this.isLoading = false;
            resolve();
          });
      });
    },

    mapJobIcons(jobs) {
      for (let i = 0; i < jobs.length; i++) {
        let prefix = jobs[i].icon_name.split(" ")[0];
        let iconName = jobs[i].icon_name.split(/-(.*)/);
        let icon = {
          prefix: prefix,
          icon: iconName[1],
        };
        jobs[i].icon_name = icon;
      }
      return jobs;
    },
  },
});

export const useJobDetailStore = defineStore("job-detail", {
  state: () => {
    return {
      item: null,
      href: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async loadJob(id, href) {
      // No need of API call if the item is already loaded
      if (
        this.item != null &&
        this.item.unique_id == id &&
        this.error == null
      ) {
        this.isLoading = false;
        return;
      }

      return new Promise((resolve) => {
        this.isLoading = true;
        this.item = null;
        this.href = null;
        this.error = null;

        axios
          .get(config.API_BASE + "/api/careers/" + id)
          .then((response) => {
            this.item = response.data;
            this.href = href;
            this.isLoading = false;
            resolve();
          })
          .catch((error) => {
            this.error = error;
            this.isLoading = false;
            resolve();
          });
      });
    },
  },
});
