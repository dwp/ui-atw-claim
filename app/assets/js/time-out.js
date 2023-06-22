import TimeoutDialog from 'hmrc-frontend/hmrc/components/timeout-dialog/timeout-dialog';

const timeoutDialog = document.querySelector('meta[name="hmrc-timeout-dialog"]');
if (timeoutDialog) {
  new TimeoutDialog(timeoutDialog).init();
}
