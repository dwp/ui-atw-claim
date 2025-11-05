const {
  PAYMENTS_CONTEXT_PATH,
} = require('../../config/uri');

module.exports = (casaApp) => {

  const claimsHistory = async (req, res) => {
    const { awardType } = { ...req.session.claimHistory };

    res.locals.sentForPayment = req.casa.journeyContext.getDataForPage('__hidden_account__')
      .account
      .sentForPayment
      .filter(
        (claim) => claim.claimType === awardType,
      );
   
    res.locals.awardType = awardType;

    const claimTypeShortcuts = {
      [res.locals.ea]: 'ea', 
      [res.locals.av]: 'av',
      [res.locals.sw]: 'sw',
      [res.locals.ttw]: 'ttw',
      [res.locals.tiw]: 'tiw'
      
    }

    res.locals.typeKey = claimTypeShortcuts[awardType]

    res.locals.isMultiAward = req.casa.journeyContext.getDataForPage(
      '__hidden_account__',
    ).account.elements.length > 1;

    res.locals.filteredSentForPayment = res.locals.sentForPayment.filter(
      (claim) => (claim.paymentStatus != 'PAID_RECONCILED' && claim.paymentStatus != 'PAID_UNRECONCILED')
    )

    res.locals.payments = res.locals.filteredSentForPayment.map(
      (claim) => {
        let newStatus,colour;

        switch (claim.paymentStatus) {
          case 'CREATED':
          case 'AUTHORISED':
            newStatus = res.locals.t('claims-payments-history:payment-status-in-progress'),
            colour="govuk-tag--blue"
            break;
          case 'POSTED':
            newStatus = res.locals.t('claims-payments-history:payment-status-sent'),
            colour="govuk-tag--green"
            break;
          case 'NOT_AUTHORISED':
          case 'REJECTED':
            newStatus = res.locals.t('claims-payments-history:payment-status-rejected'),
            colour="govuk-tag--red"
            break;
        }

        return {...claim, paymentStatus: {text: newStatus , statusColour: colour}}
      }
    )

    let currentYear = new Date().getFullYear();
    res.locals.years  = [ currentYear, currentYear-1, currentYear-2, currentYear-3 ]

    res.locals.tableTitles = [ { text: res.locals.t('claims-payments-history:h-claim-date-range') }, 
                            { text: res.locals.t('claims-payments-history:h-payee') }, 
                            { text: res.locals.t('claims-payments-history:h-amount') }, 
                            { text: res.locals.t('claims-payments-history:h-updated') }, 
                            { text:res.locals.t('claims-payments-history:h-status') } ]
                               
    res.locals.tabLabels = res.locals.years.map( year => (res.locals.locale == "cy") ? 
                                                      (res.locals.t('claims-payments-history:h1') + " " + year) 
                                                      : ( year + " " +  res.locals.t('claims-payments-history:h1')) )

                                            
    const getYearFromDateString = (dateString) => {
      return new Date(dateString).getFullYear()
    }

    const getPayeeInfo = (id) => {
      let payees = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees

      let payeeInfo = payees.find( payee => Number(payee.id) == Number(id))

      return payeeInfo?.name ?? payeeInfo?.bankAccountName ?? ""
    }

    const getHTMLStatus = (status) => {
      return `<strong class="govuk-tag ${status.statusColour ? ` ${status.statusColour}` : ''}">${status.text}</strong>`
    }

    const getHTMLClaimDateRange = (claimDateRange) => {
      let text = getLiteralDate(claimDateRange,false)
      return `<strong class="'govuk-!-font-weight-bold'">${text}</strong>`
    }

    const getLiteralDate = (rawDate, includeYear) => {
      const date = new Date(rawDate)

      const options = {
        day: "numeric",
        month: "long",
        ...(includeYear && { year: "numeric"})
      }

      const parts = new Intl.DateTimeFormat(res.locals.locale,options).formatToParts(date)

      const get = t => parts.find(p => p.type === t)?.value ?? '';

      const formatted = includeYear ? `${get('day')} ${get('month')} ${get('year')}`.trim() : `${get('day')} ${get('month')}`

      return formatted
    }

    const getPaymentUpdatedValue = (receivedOn,sentForPaymentOn) => {
    
      let updatedValue = sentForPaymentOn && sentForPaymentOn.trim() !== '' ? sentForPaymentOn : receivedOn
      return getLiteralDate(updatedValue,true)
    }

    const getPaymentRow = (rawPayment,payee) => {

      let claimDateRange = getHTMLClaimDateRange(rawPayment.periodEndsOn)
      let amount = "£" + rawPayment.amountPaid
      let updated = getPaymentUpdatedValue(rawPayment.receivedOn,rawPayment.sentForPaymentOn)
      let status = getHTMLStatus(rawPayment.paymentStatus)
    
      return [ { html: claimDateRange}, { text: payee }, { text: amount }, { text: updated }, { html: status } ] 
    }

    const getPaymentsRowsForYear = (year) => {
    
      if (res.locals.payments.length > 0) {
        let paymentsInYear = res.locals.payments.filter( payment => getYearFromDateString(payment.periodEndsOn) == year)
        let paymentsSorted = paymentsInYear.sort((a,b) => {
          return new Date(b.periodEndsOn) - new Date(a.periodEndsOn)
        })
        let payments = paymentsSorted.map( payment => getPaymentRow(payment, getPayeeInfo(payment.payeeId)))

        return payments
      }
      else return []
    }

    

    res.locals.multiplePaymentRowsCurrentYear = getPaymentsRowsForYear(res.locals.years[0])
    res.locals.multiplePaymentRowsCurrentYearMinusOne = getPaymentsRowsForYear(res.locals.years[1])
    res.locals.multiplePaymentRowsCurrentYearMinusTwo = getPaymentsRowsForYear(res.locals.years[2])
    res.locals.multiplePaymentRowsCurrentYearMinusThree = getPaymentsRowsForYear(res.locals.years[3])
    return res.render('pages/account/payments-claims-history.njk');
  };

  casaApp.router.get(`${PAYMENTS_CONTEXT_PATH}/your-claims-payments`, casaApp.csrfMiddleware, claimsHistory);

  return { claimsHistory };
};