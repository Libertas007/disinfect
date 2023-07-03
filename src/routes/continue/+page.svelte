<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	if (browser) {
		setTimeout(() => {
			const urlParams = new URLSearchParams(window.location.search);
			const action = urlParams.get('mode');
			const actionCode = urlParams.get('oobCode');

			switch (action) {
				case 'resetPassword':
					goto('/continue/reset?oobCode=' + actionCode);
					break;
				case 'recoverEmail':
					goto('/continue/recover?oobCode=' + actionCode);
					break;
				case 'verifyEmail':
					goto('/continue/verify?oobCode=' + actionCode);
					break;
			}
		}, 500);
	}
</script>

<p>Wait a minute, getting you to the right place...</p>
