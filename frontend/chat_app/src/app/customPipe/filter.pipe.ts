import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone:true
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchedWord:string) {
    if(!searchedWord) return value;
    return value.filter((user) => user.toLowerCase().includes(searchedWord.toLowerCase()));
  }
}
