'use strict';
import { TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataTableModule, SharedModule, OverlayPanelModule, PickListModule, DragDropModule, CalendarModule, 
    FileUpload, FileUploadModule, ListboxModule, DialogModule, CheckboxModule, DropdownModule, RadioButtonModule, 
    ProgressBarModule, ProgressSpinnerModule, AccordionModule, GrowlModule  } from 'primeng/primeng';
import { JL } from 'jsnlog';
import { StorageServiceModule, SESSION_STORAGE } from 'angular-webstorage-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs';

import { OrderablePickList } from './picklist.component';
import { PageService } from '../../../../services/page.service';
import { CustomHttpClient } from '../../../../services/httpclient.service';
import { LoaderService } from '../../../../services/loader.service';
import { ConfigService } from '../../../../services/config.service';
import { LoggerService } from '../../../../services/logger.service';
import { SessionStoreService, CUSTOM_STORAGE } from '../../../../services/session.store';
import { AppInitService } from '../../../../services/app.init.service';

let fixture, app, pageService;

class MockPageService {
    eventUpdate$: Subject<any>;

    constructor() {
        this.eventUpdate$ = new Subject();
    }

    logError(a) {
        this.eventUpdate$.next(a);
    }
}

describe('OrderablePickList', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          OrderablePickList
       ],
       imports: [
           PickListModule,
           HttpModule,
           HttpClientTestingModule,
           StorageServiceModule
       ],
       providers: [
           { provide: CUSTOM_STORAGE, useExisting: SESSION_STORAGE },
           { provide: 'JSNLOG', useValue: JL },
           { provide: PageService, useClass: MockPageService },
           CustomHttpClient,
           LoaderService,
           ConfigService,
           LoggerService,
           AppInitService,
           SessionStoreService
       ]
    }).compileComponents();
    fixture = TestBed.createComponent(OrderablePickList);
    app = fixture.debugElement.componentInstance;
    pageService = TestBed.get(PageService);
  }));

    it('should create the app', async(() => {
      expect(app).toBeTruthy();
    }));

    it('setState() should update the frmInp.element.leafState', async(() => {
      const frmInp = { element: { leafState: '' } };
      app.setState('t', frmInp);
      expect(frmInp.element.leafState).toEqual('t');
    }));

    it('updateListValues() should update the value property as null', async(() => {
      app.targetList = [];
      app.updateListValues('');
      expect(app.value).toEqual(null);
    }));

    it('updateListValues() should update the value property from targetList[]', async(() => {
      app.targetList = [{ code: 'test' }];
      app.updateListValues('');
      expect(app.value).toEqual(['test']);
    }));

    it('value property should be updated from set value()', async(() => {
      app.value = 'test';
      expect(app.value).toEqual('test');
    }));

    it('dragStart() should update the draggedItm property', async(() => {
      app.element = { enabled: true };
      app.dragStart('', 't');
      expect(app.draggedItm).toEqual('t');
    }));

    it('findIndexInList() should return 0', async(() => {
      const list = [{ code: 123 }];
      const item = { code: 123 };
      expect(app.findIndexInList(item, list)).toEqual(0);
    }));

    it('registerOnChange() should update the onChange property', async(() => {
      const onChange = () => {};
      app.registerOnChange(onChange);
      expect(app.onChange).toEqual(onChange);
    }));

    it('registerOnTouched() should update the onTouched property', async(() => {
      const onTouched = () => {};
      app.registerOnTouched(onTouched);
      expect(app.onTouched).toEqual(onTouched);
    }));

    it('setDisabledState() should update the disabled property', async(() => {
      app.setDisabledState(false);
      expect(app.disabled).toEqual(false);
    }));

    it('ngOnInit() should call the form.controls.a.setValue() and update the targetList as empty string', async(() => {
      app.element = { path: 't', leafState: '', config: { code: 'a' } };
      app.form = { controls: { a: { valueChanges: Observable.of(''), setValue: a => {} } } };
      const eve = { path: 'test', config: { code: 'a' } };
      app.ngOnInit();
      spyOn(app.form.controls.a, 'setValue').and.callThrough();
      pageService.logError(eve);
      expect(app.form.controls.a.setValue).toHaveBeenCalled();
      expect(app.targetList).toEqual('');
    }));

    it('ngOnInit() should call the form.controls.a.setValue() and update the targetList as []', async(() => {
      app.element = { path: 't', leafState: null, config: { code: 'a' } };
      app.form = { controls: { a: { valueChanges: Observable.of(''), setValue: a => {} } } };
      const eve = { path: 'test', config: { code: 'a' } };
      app.ngOnInit();
      spyOn(app.form.controls.a, 'setValue').and.callThrough();
      pageService.logError(eve);
      expect(app.form.controls.a.setValue).toHaveBeenCalled();
      expect(app.targetList).toEqual([]);
    }));

    it('dragEnd() should update the pickListControl.target', async(() => {
      app.draggedItm = true;
      app.targetList = [];
      app.pickListControl = { source: ['a', 'b'], target: [] };
      spyOn(app, 'findIndexInList').and.returnValue(1);
      app.dragEnd('');
      expect(app.pickListControl.target).toEqual([true]);
    }));

    it('dragEnd() should update the pickListControl.source', async(() => {
      app.draggedItm = true;
      app.targetList = [{ code: 'c' }];
      app.pickListControl = { source: ['a', 'b'], target: [] };
      app.findIndexInList = (a, b) => {
        if (b === app.pickListControl.source) {
          return -1;
        }
        return 1;
      };
      app.dragEnd('');
      expect(app.pickListControl.source).toEqual(['a', 'b', true]);
    }));

});