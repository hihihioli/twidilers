// Popover logic for followers / following lists
(function(){
	const followerTrigger = document.querySelector('[data-popover="followers"]');
	const followingTrigger = document.querySelector('[data-popover="following"]');
	const followersPop = document.getElementById('followers-pop');
	const followingPop = document.getElementById('following-pop');
	if(!followerTrigger || !followingTrigger) return;

	function positionPanel(trigger, panel){
		const rect = trigger.getBoundingClientRect();
		panel.style.top = (window.scrollY + rect.bottom + 6) + 'px';
		panel.style.left = (window.scrollX + rect.left) + 'px';
	}

	function show(panel, trigger){
		hideAll();
		positionPanel(trigger, panel);
		panel.classList.add('show');
		panel.setAttribute('aria-hidden','false');
	}
	function hide(panel){
		panel.classList.remove('show');
		panel.setAttribute('aria-hidden','true');
	}
	function hideAll(){
		hide(followersPop); hide(followingPop);
	}

	// Hover (mouse) interaction
	[
		{trigger: followerTrigger, panel: followersPop},
		{trigger: followingTrigger, panel: followingPop}
	].forEach(({trigger,panel}) => {
		trigger.addEventListener('mouseenter', () => show(panel, trigger));
		trigger.addEventListener('mouseleave', () => setTimeout(()=>{
			if(!panel.matches(':hover')) hide(panel);
		},150));
		panel.addEventListener('mouseleave', () => hide(panel));
		panel.addEventListener('mouseenter', () => positionPanel(trigger,panel));
		trigger.addEventListener('focus', () => show(panel, trigger));
		trigger.addEventListener('blur', () => hide(panel));
	});

	// Touch / click toggle
	[followerTrigger, followingTrigger].forEach(t => {
		t.addEventListener('click', (e) => {
			const panel = t.dataset.popover === 'followers' ? followersPop : followingPop;
			if(panel.classList.contains('show')) { hide(panel); }
			else { show(panel, t); }
			e.preventDefault();
			e.stopPropagation();
		});
	});
	document.addEventListener('click', hideAll);
	document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hideAll(); });
})();
