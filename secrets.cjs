/**
 * SECRETS.CJS - Built-in "Encryption" Layer for VestBot
 * Only the program logic knows how to reassemble these keys.
 */

const SALT = "VESTBOT_SAIYAN_PRIDE_2027";

// Ofuscated Keys (Base64 + Simple Rotation)
const _keys = [
    "VmpOVFZFRkplbUZUZVVKVlN6VlJNVkpLU0d0WWR6WjZRVmwxVW1KTk0ydFhiVlI1ZUU1SFZqWklidz09",
    "VmpOVFZFRkplbUZUZVVGc2FHMHRhRzVxYkhOTExVVkJURzlhYVZsNU1YcGtUV3hwUXpGclZuSkxTUT09",
    "VmpOVFZFRkplbUZUZVVJd1ozcG9WWFY2ZWtJNVEwWlhURkJEYjFKTmNYZDBkbU5uWjFsaGJuSnlkdz09",
    "VmpOVFZFRkplbUZUZVVGSFNqZGxlbTlMYVcxTU9FcGlXbUUyZDFKbFh6RjVhRlUyZFdKWE16VlFWUT09",
    "VmpOVFZFRkplbUZUZVVOQ01XeHpVWGh5UTBKMmVqUmZMUzB3TW01NFZETndjMHRPZG5aa1VEbDBUUT09",
    "VmpOVFZFRkplbUZUZVVGM1dqZzBjWFJUWVcxU1ZqVkhWa2t3WkROS1VuYzVUemRJTkdKMk1WOXhjdz09",
    "VmpOVFZFRkplbUZUZVVOeVptZEVTRUpXTW5neFlrOXlURGhVYlV0YWRuUjJjMWN3UjB4d1dqWk5WUT09",
    "VmpOVFZFRkplbUZUZVVSSFRGWjZTVzlCVUdSTGNuRktkbGhUTjBwSFNqRXdXbWxXYUdKc1lqbENWUT09",
    "VmpOVFZFRkplbUZUZVVGV2RHSmFaRVV4V1VsbFJXbERhREpFV0RaVFMyUmljVE5yVDBOVFQyVmFSUT09"
];

function _decode(str) {
    try {
        const stage1 = Buffer.from(str, 'base64').toString();
        const stage2 = Buffer.from(stage1, 'base64').toString();
        return stage2.substring(4); // Remove prefix
    } catch (e) {
        return null;
    }
}

module.exports = {
    getGeminiKeys: () => _keys.map(k => _decode(k)).filter(k => !!k)
};
