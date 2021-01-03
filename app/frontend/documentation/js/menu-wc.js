'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Application documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' : 'data-target="#xs-components-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' :
                                            'id="xs-components-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookingConfirmComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookingConfirmComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookingConfirmationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookingConfirmationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookingDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookingDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookingListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookingListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookingListDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookingListDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookingSummaryDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookingSummaryDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmationDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmationDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmationTemplateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmationTemplateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemListDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemListDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MailSenderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MailSenderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplateDetailDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TemplateDetailDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplateListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TemplateListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' : 'data-target="#xs-injectables-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' :
                                        'id="xs-injectables-links-module-AppModule-dd3125169c18489252314ee4573c49f1"' }>
                                        <li class="link">
                                            <a href="injectables/ComponentBridgingService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ComponentBridgingService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BookedItem.html" data-type="entity-link">BookedItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/Booking.html" data-type="entity-link">Booking</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmationTemplate.html" data-type="entity-link">ConfirmationTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Email.html" data-type="entity-link">Email</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailTemplate.html" data-type="entity-link">EmailTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExceedAmountValidator.html" data-type="entity-link">ExceedAmountValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/Issue.html" data-type="entity-link">Issue</a>
                            </li>
                            <li class="link">
                                <a href="classes/Items.html" data-type="entity-link">Items</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BookingsService.html" data-type="entity-link">BookingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ComponentBridgingService.html" data-type="entity-link">ComponentBridgingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmationTemplatesService.html" data-type="entity-link">ConfirmationTemplatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailTemplatesService.html" data-type="entity-link">EmailTemplatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueService.html" data-type="entity-link">IssueService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ItemsService.html" data-type="entity-link">ItemsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link">LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailerService.html" data-type="entity-link">MailerService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/JwtInterceptor.html" data-type="entity-link">JwtInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/RefreshInterceptor.html" data-type="entity-link">RefreshInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/LoginDetail.html" data-type="entity-link">LoginDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Token.html" data-type="entity-link">Token</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});