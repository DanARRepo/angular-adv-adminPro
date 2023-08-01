import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(image: string, type: 'users' | 'doctors' | 'hospitals'): string {

    if (!image) {
      return `${base_url}/uploads/users/no-image`
    } else if (image?.includes('https')) {
      return image;
    } else if (image) {
      return `${base_url}/uploads/${type}/${image}`;
    } else {
      return `${base_url}/uploads/users/no-image`
    }

  }

}
