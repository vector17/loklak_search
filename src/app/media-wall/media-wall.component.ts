import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as mediaWallAction from '../actions/media-wall';

import { Query } from '../models/query';
import { ApiResponse, ApiResponseResult } from '../models/api-response';



@Component({
	selector: 'app-media-wall',
	templateUrl: './media-wall.component.html',
	styleUrls: ['./media-wall.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaWallComponent implements OnInit, AfterViewInit, OnDestroy {
	private __subscriptions__: Subscription[] = new Array<Subscription>();

	public query$: Observable<Query>;
	public apiResponseResults$: Observable<ApiResponseResult[]>;
	public isSearching$: Observable<boolean>;


	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private elementRef: ElementRef,
		private store: Store<fromRoot.State>
	) { }

	ngOnInit() {
		this.queryFromURL();
		this.getDataFromStore();
	}

	ngAfterViewInit() {
		this.focusTextbox();
	}

	/**
	 * Focus the search box on the `Loading` of the Feedpage.
	 */
	private focusTextbox(): void {
		this.elementRef.nativeElement.querySelector('media-wall-header .header-wrapper .header .title').focus();
	}

	private queryFromURL(): void {
		this.__subscriptions__.push(
			this.route.queryParams
					.subscribe((params: Params) => {
						const queryParam = params['query'] || '';
						this.store.dispatch(new mediaWallAction.WallInputValueChangeAction(queryParam));
					})
		);
	}

	/**
	 * Getting the data(Observables) from store into the component.
	 */
	private getDataFromStore(): void {
		this.query$ = this.store.select(fromRoot.getMediaWallQuery);
		this.apiResponseResults$ = this.store.select(fromRoot.getApiResponseEntities);
		this.isSearching$ = this.store.select(fromRoot.getSearchLoading);
	}



	/**
	 * Clearup all the subscription when component is destroyed.
	 */
	ngOnDestroy() {
		this.__subscriptions__.forEach(subscription => subscription.unsubscribe());
	}

}
