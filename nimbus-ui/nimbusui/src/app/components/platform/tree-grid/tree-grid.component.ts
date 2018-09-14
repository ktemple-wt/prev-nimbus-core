/**
 * @license
 * Copyright 2016-2018 the original author or authors.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Component, Input } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms/src/directives';
import { BaseElement } from './../base-element.component';
import { WebContentSvc } from '../../../services/content-management.service';
import { ParamConfig } from '../../../shared/param-config';
import { PageService } from '../../../services/page.service';
import { GenericDomain } from '../../../model/generic-domain.model';
import { Param, TreeGridDeserializer } from '../../../shared/param-state';
import { HttpMethod } from './../../../shared/command.enum';
import { DateTimeFormatPipe } from '../../../pipes/date.pipe';
import { ViewComponent} from '../../../shared/param-annotations.enum';


/**
 * \@author Vivek Kamineni
 * \@whatItDoes A control to be used to display closely related data in a Tree structure.
 */


@Component({
    selector: 'nm-treegrid',
    providers: [WebContentSvc, DateTimeFormatPipe],
    templateUrl: './tree-grid.component.html'
})
export class TreeGrid extends BaseElement  implements ControlValueAccessor {

    @Input() params: ParamConfig[];
    @Input() form: FormGroup;
    firstColumn: ParamConfig;
    viewComponent = ViewComponent;

    treeData: any;

    public onChange: any = (_) => { /*Empty*/ }
    public onTouched: any = () => { /*Empty*/ }

    public writeValue(obj: any): void {
        if (obj !== undefined) {
        }
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    constructor(private _wcs: WebContentSvc, private pageSvc: PageService,  private dtFormat: DateTimeFormatPipe) {
        super(_wcs);
    }

    ngOnInit() {
        super.ngOnInit();

        this.pageSvc.processEvent(this.element.path, '$execute', new GenericDomain(), HttpMethod.GET.value, undefined);
        this.pageSvc.gridValueUpdate$.subscribe((treeList: Param) => {
            if(this.element.path === treeList.path){
                this.treeData = this.getTreeStructure(treeList.gridList);
                //this.treeData = [{data:{"elemId":"0","id":14,"firstName":"own","lastName":"onw","ownerCity":"Middletown","telephone":"8987898989","nestedGridParam":[]}}];
            }
        });

        if (this.params) {
            this.params.forEach(column => {
                column.label = this._wcs.findLabelContentFromConfig(this.element.elemLabels.get(column.id), column.code).text;
                column['field'] = column.code;
                column['header'] = column.label;                  
            });

            this.firstColumn = this.params.find((param) => param.uiStyles && param.uiStyles.attributes.hidden === false);
        }
        
    }

    getTreeStructure(gridList: any[]) {
        let data: any[] = [];
        gridList.forEach(row => {                    
            new TreeGridDeserializer().deserialize(row)            
            data.push(new TreeGridDeserializer().deserialize(row));        
        });

        return data;
    }

    getCellDisplayValue(rowData: any, col: ParamConfig) {
        let cellData = rowData[col.code];
        if (cellData) {
            if (super.isDate(col.type.name)) {
                return this.dtFormat.transform(cellData, col.uiStyles.attributes.datePattern, col.type.name);
            } else {
                return cellData;
            }
        }
        else {
            return col.uiStyles.attributes.placeholder;
        }
    }

    showColumn(col: ParamConfig) {
        if (col.uiStyles && col.uiStyles.attributes.hidden === false && col.uiStyles.attributes.alias !== ViewComponent.button.toString()) {

            return true;
        } 
        return false;
    }

    getViewParam(col: ParamConfig, rowIndex: number): Param {
        return this.element.collectionParams.find(ele => ele.path == this.element.path + '/'+rowIndex+'/' + col.code);
    }

    showHeader(col: ParamConfig) {
        if (col.uiStyles && col.uiStyles.attributes.hidden === false &&
            col.uiStyles.attributes.alias === 'GridColumn') {
            return true;
        } 
        return false;
    }
    
}