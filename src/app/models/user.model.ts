import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class User {

    constructor(
        public name: string,
        public email: string,
        public password?: string,
        public image?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string,
    ) {}

    get imageUrl() {

        if ( !this.image ) {
            return `${base_url}/uploads/users/no-image`
        } else if ( this.image?.includes('https') ) {
            return this.image;
        }else if ( this.image ) {
            return `${base_url}/uploads/users/${this.image}`;
        } else {
            return `${base_url}/uploads/users/no-image`
        }
    }
}