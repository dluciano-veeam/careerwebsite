
$(document).ready(function(){

	/* Close sidebar when pressing Enter inside search (mobile UX) */
	$('#sidebarSearch').on('keydown', function(e){

	/* only Enter key */
	if(e.key === 'Enter'){

		/* close menu */
		$('#index').removeClass('open');

		/* restore closed icon */
		$('#toggleMenu').html(svgClosed);

		/* optional: remove focus to hide mobile keyboard */
		this.blur();
	}
	});

	const svgClosed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"/></svg>`;
    const svgOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>`;

    $('#toggleMenu').on('click', function(e){
		e.stopPropagation();
        $('#index').toggleClass('open');
		// Toggle the SVG inside the button
        $(this).html( $('#index').hasClass('open') ? svgOpen : svgClosed );
    });

	/* Open search (mobile) */
	$('#searchMenu').on('click', function(e){
		e.stopPropagation();
		$('#index').addClass('open');
		$('#toggleMenu').html(svgOpen);
		const input = document.getElementById('sidebarSearch');
		if(input){
			input.focus();
			input.setSelectionRange(input.value.length, input.value.length);
		}
	});

	/* Close menu when clicking outside (mobile) */
	$(document).on('click', function(e){
		if(window.innerWidth >= 900) return;
		const $index = $('#index');
		if(!$index.hasClass('open')) return;
		const isInsideMenu = $(e.target).closest('#index').length > 0;
		const isToggle = $(e.target).closest('#toggleMenu, #searchMenu').length > 0;
		if(!isInsideMenu && !isToggle){
			$index.removeClass('open');
			$('#toggleMenu').html(svgClosed);
		}
	});

	/* Sidebar submenu toggle */
	document.querySelectorAll('#index .menu-toggle').forEach(toggle => {
		const group = toggle.closest('.menu-group');
		const sublist = group?.querySelector('.menu-sublist');
		if(!group || !sublist) return;

		toggle.addEventListener('click', () => {
			const isOpen = group.classList.toggle('open');
			toggle.setAttribute('aria-expanded', String(isOpen));
			sublist.setAttribute('aria-hidden', String(!isOpen));
		});
	});

    // Initial: SVG closed
    $('#toggleMenu').html(svgClosed);

	/* Smooth scroll */
	$(document).on('click','a[href^="#"]:not([data-no-smooth])',function(e){
		e.preventDefault();
		let target = $($(this).attr('href'));
		if(target.length){
			$('html,body').animate({
				scrollTop: target.offset().top - 90
			}, 600);
		}
		if(window.innerWidth < 900){
			$('#index').removeClass('open');
			$('#toggleMenu').html(svgClosed);
		}
	});

	/* Active menu on scroll */
	$(window).on('scroll', function(){
		let scrollPos = $(document).scrollTop();
		$('.category').each(function(){
			let top = $(this).offset().top - 100;
			let bottom = top + $(this).outerHeight();
			if(scrollPos >= top && scrollPos <= bottom){
				$('#index a').removeClass('active');
				$('#index a[href="#'+this.id+'"]').addClass('active');
			}
		});

		// Keep parent menu highlighted when a child is active
		$('.menu-group').each(function(){
			const hasActiveChild = $(this).find('.menu-sublist a.active').length > 0;
			$(this).toggleClass('active', hasActiveChild);
		});

		if(scrollPos > 300){
			$('#backToTop').fadeIn();
		}else{
			$('#backToTop').fadeOut();
		}
	});

	/* Hover highlight */
	$('.category').on('mouseenter', function(){
		$('#index a').removeClass('active');
		$('#index a[href="#'+this.id+'"]').addClass('active');

		$('.menu-group').each(function(){
			const hasActiveChild = $(this).find('.menu-sublist a.active').length > 0;
			$(this).toggleClass('active', hasActiveChild);
		});
	});

	/* Back to top */
	$('#backToTop').on('click', function(){
		$('html,body').animate({ scrollTop:0 },600);
	});


/* =========================
   BANNER FADE — STABLE
========================= */

let bannerIndex = 1;
const totalBanners = 3;
const fadeDuration = 1000;
const delayBetween = 3000;

let bannerTimer = null;
let initialized = false;

const $main = $('#bannerImage');
const $next = $('#bannerImageNext');
const $container = $('#topBannerPicture');

function getBannerPath(index){
    const w = window.innerWidth;
    let size = 'large';

    if(w <= 599) size = 'mobile';
    else if(w <= 899) size = 'tablet';
    else if(w <= 1199) size = 'desktop';

    return `banner${index}-${size}.png`;
}

function setContainerHeight(){
    $container.height($main.height());
}

function scheduleNext(){
    bannerTimer = setTimeout(updateBanner, delayBetween);
}

function updateBanner(){

	const nextIndex = bannerIndex < totalBanners ? bannerIndex + 1 : 1;
	const nextPath = getBannerPath(nextIndex);

	/* preload off-DOM to avoid mobile flicker or broken icon */
	const preload = new Image();

	preload.onload = function(){

		$next
			.attr('src', nextPath)
			.css({ opacity:0, display:'block' })
			.fadeTo(fadeDuration, 1, function(){

				$main.attr('src', nextPath);

				$next.hide().css('opacity',0);

				bannerIndex = nextIndex;

				setContainerHeight();
				scheduleNext();
			});
	};

	preload.src = nextPath;
}

/* INIT — banner animation */
$main
    .off('load')
    .on('load', function(){
        setContainerHeight();

        if(!initialized){
            initialized = true;

			// Small delay to stabilize the first frame
            setTimeout(scheduleNext, delayBetween);
        }
    })
    .attr('src', getBannerPath(bannerIndex));

/* Resize — do NOT change image source */
$(window).on('resize', function(){
    setContainerHeight();
});

// Pause/resume banner rotation when switching tabs
document.addEventListener('visibilitychange', function(){
    clearTimeout(bannerTimer);
    if(!document.hidden){
        setTimeout(scheduleNext, delayBetween);
    }
});

});



document.addEventListener("DOMContentLoaded", () => {
	const menuLinks = document.querySelectorAll("#index a");
	const sections = [...menuLinks].map(link =>
		document.querySelector(link.getAttribute("href"))
	);

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if(entry.isIntersecting){
				menuLinks.forEach(l => l.classList.remove("active"));
				const activeLink = document.querySelector(
					`#index a[href="#${entry.target.id}"]`
				);
				if(activeLink) activeLink.classList.add("active");
			}
		});
	}, {
		rootMargin: "-40% 0px -50% 0px",
		threshold: 0
	});

	sections.forEach(section => {
		if(section) observer.observe(section);
	});
});



(function(){

	const input = document.getElementById('sidebarSearch');
	const countEl = document.getElementById('searchCount');
	const contentRoot = document.querySelector('body');

	let currentHits = [];

	function clearHighlights(){
		currentHits.forEach(span => {
			const parent = span.parentNode;
			parent.replaceChild(document.createTextNode(span.textContent), span);
			parent.normalize();
		});
		currentHits = [];
		countEl.textContent = '';
	}

	function highlight(text){
		if(!text) return;

		const walker = document.createTreeWalker(
			contentRoot,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode(node){
					if(!node.parentNode) return NodeFilter.FILTER_REJECT;
					if(['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.parentNode.tagName))
						return NodeFilter.FILTER_REJECT;
					if(node.parentNode.classList?.contains('search-hit'))
						return NodeFilter.FILTER_REJECT;
					if(!node.nodeValue.toLowerCase().includes(text))
						return NodeFilter.FILTER_REJECT;
					return NodeFilter.FILTER_ACCEPT;
				}
			}
		);

		let firstMatch = null;
		let total = 0;

		while(walker.nextNode()){
			const node = walker.currentNode;
			const value = node.nodeValue;
			const lower = value.toLowerCase();
			const index = lower.indexOf(text);

			if(index === -1) continue;

			const range = document.createRange();
			range.setStart(node, index);
			range.setEnd(node, index + text.length);

			const span = document.createElement('span');
			span.className = 'search-hit';
			range.surroundContents(span);

			currentHits.push(span);
			total++;

			if(!firstMatch) firstMatch = span;
		}

		if(total){
			countEl.textContent = `${total} result${total > 1 ? 's' : ''} found`;
		}else{
			countEl.textContent = 'No results';
		}

		if(firstMatch){
			firstMatch.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	}

	input.addEventListener('input', function(){
		const value = this.value.trim().toLowerCase();
		clearHighlights();
		if(value.length >= 2){
			highlight(value);
		}
	});

})();


(function(){

	const mapHosts = [...document.querySelectorAll(".career-path-map")];
	if(!mapHosts.length) return;

	const tracks = [
		{ key: "support", label: "Support Track", tabLabel: "Support", color: "#00D15F", glow: "rgba(0,209,95,.28)", href: "SupportTrack.pdf", thumb: "SupportTrack-thumb.png", tooltipText: "Download Support Track PDF" },
		{ key: "expert", label: "Expert Track", tabLabel: "Expert", color: "#FD8A26", glow: "rgba(253,138,38,.28)", href: "ExpertTrack.pdf", thumb: "ExpertTrack-thumb.png", tooltipText: "Download Expert Track PDF" },
		{ key: "manager", label: "Manager Track", tabLabel: "Manager", color: "#8E71F4", glow: "rgba(142,113,244,.26)", href: "ManagerTrack.pdf", thumb: "ManagerTrack-thumb.png", tooltipText: "Download Manager Track PDF" },
		{ key: "executive", label: "Executive Track", tabLabel: "Executive", color: "#57E0FF", glow: "rgba(87,224,255,.26)", href: "ExecutiveTrack.pdf", thumb: "ExecutiveTrack-thumb.png", tooltipText: "Download Executive Track PDF" }
	];

	mapHosts.forEach((mapHost, mapIndex) => {
		const svg = mapHost.querySelector("svg");
		if(!svg) return;
		const trackByKey = new Map(tracks.map(track => [track.key, track]));
		const orderedTrackNodes = new Map();
		const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
		const tooltip = document.createElement("div");
		tooltip.className = "career-track-tooltip";
		tooltip.innerHTML = `
			<img class="career-track-thumb" alt="" loading="lazy" decoding="async">
			<span class="career-track-tooltip-text">Download detailed PDF</span>
		`;
		const tooltipImg = tooltip.querySelector(".career-track-thumb");
		const tooltipText = tooltip.querySelector(".career-track-tooltip-text");
		document.body.appendChild(tooltip);

		svg.setAttribute("role", "img");
		svg.setAttribute("aria-label", `Career path map ${mapIndex + 1}`);

		// Labels are outlined paths; disable pointer events so clicks hit colored shapes.
		svg.querySelectorAll('[fill="white"], [fill="#FFFFFF"], [fill="#fff"], [fill="black"], [fill="#000"], [fill="#000000"], [fill="#000000FF"]').forEach(node => {
			node.classList.add("track-label");
		});

		tracks.forEach(track => {
			const nodes = svg.querySelectorAll(`[fill="${track.color}"]`);
			nodes.forEach(node => {
				node.classList.add("track-shape", `track-${track.key}`);
				node.setAttribute("data-track-key", track.key);
				node.setAttribute("data-no-smooth", "true");
				node.style.setProperty("--track-glow", track.glow);
			});
		});

		const trackNameMatchers = [
			{ key: "support", pattern: /support/i },
			{ key: "expert", pattern: /expert/i },
			{ key: "manager", pattern: /manager/i },
			{ key: "executive", pattern: /executive/i }
		];

		const gradientTrackMap = {};
		svg.querySelectorAll("defs linearGradient[id]").forEach(gradient => {
			const gradientId = gradient.id;
			const stops = [...gradient.querySelectorAll("stop")]
				.map(stop => (stop.getAttribute("stop-color") || "").toUpperCase());
			const keys = tracks
				.filter(item => stops.includes(item.color.toUpperCase()))
				.map(item => item.key);
			if(keys.length){
				gradientTrackMap[gradientId] = keys;
			}
		});

		const extractTrackKeysFromLabel = label => {
			if(!label) return [];
			const hits = new Set();
			trackNameMatchers.forEach(matcher => {
				if(matcher.pattern.test(label)){
					hits.add(matcher.key);
				}
			});
			return [...hits];
		};

		const resolveArrowTrackKeys = node => {
			const labels = [];
			let current = node;
			while(current && current !== svg){
				["id", "data-name", "aria-label", "inkscape:label", "class"].forEach(attr => {
					const value = current.getAttribute && current.getAttribute(attr);
					if(value){
						labels.push(value);
					}
				});
				current = current.parentElement;
			}

			const labeledKeys = new Set();
			labels.forEach(label => {
				extractTrackKeysFromLabel(label).forEach(key => labeledKeys.add(key));
			});
			if(labeledKeys.size){
				return [...labeledKeys];
			}

			const fillValue = node.getAttribute("fill") || "";
			const match = fillValue.match(/^url\(#([^)]+)\)$/);
			if(!match) return [];
			return gradientTrackMap[match[1]] || [];
		};

		[...svg.querySelectorAll('[fill^="url(#paint"]')].forEach(node => {
			const trackKeys = resolveArrowTrackKeys(node);
			if(!trackKeys.length) return;

			node.classList.add("track-arrow");
			node.setAttribute("data-track-keys", trackKeys.join(","));
			trackKeys.forEach(trackKey => node.classList.add(`track-arrow-${trackKey}`));

			const primaryTrack = tracks.find(item => item.key === trackKeys[0]);
			if(primaryTrack){
				node.style.setProperty("--track-glow", primaryTrack.glow);
			}
		});

		let activeTrackKey = null;
		let mobileUi = null;
		let panX = 0;
		let panMinX = 0;
		let panMaxX = 0;
		let hasPlayedMobilePeek = false;
		let suppressTrackClick = false;

		function setPan(nextPanX){
			panX = Math.min(panMaxX, Math.max(panMinX, nextPanX));
			svg.style.transform = `translateX(${panX}px)`;
		}

		function updateMobilePanBounds(){
			if(!isMobile()){
				panX = 0;
				panMinX = 0;
				panMaxX = 0;
				svg.style.transform = "";
				return;
			}

			const visibleWidth = mapHost.clientWidth;
			const contentWidth = svg.getBoundingClientRect().width;
			const extra = Math.max(0, contentWidth - visibleWidth);
			const fadeSlack = 36;
			panMinX = -(extra + fadeSlack);
			panMaxX = fadeSlack;
			setPan(panX);
		}

		function playMobilePeekOnce(){
			if(!isMobile() || hasPlayedMobilePeek) return;
			hasPlayedMobilePeek = true;
			const travel = Math.min(140, Math.abs(panMinX) * 0.28);
			if(travel < 8) return;

			// Reveal there is hidden content to the right:
			// map shifts left with a quick impulse, then glides and settles.
			const impulseTarget = Math.max(panMinX, -(travel * 0.35));
			const finalTarget = Math.max(panMinX, -travel);
			const impulseMs = 320;
			const glideMs = 2200;
			const totalMs = impulseMs + glideMs;
			let t0 = 0;

			const easeOutQuad = t => 1 - ((1 - t) * (1 - t));
			const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

			const tick = now => {
				if(!isMobile()) return;
				const elapsed = now - t0;
				if(elapsed <= impulseMs){
					const p = easeOutQuad(Math.min(1, elapsed / impulseMs));
					setPan(impulseTarget * p);
					requestAnimationFrame(tick);
					return;
				}

				if(elapsed <= totalMs){
					const p = easeOutCubic(Math.min(1, (elapsed - impulseMs) / glideMs));
					setPan(impulseTarget + ((finalTarget - impulseTarget) * p));
					requestAnimationFrame(tick);
					return;
				}

				setPan(finalTarget);
			};

			window.setTimeout(() => {
				if(!isMobile()) return;
				t0 = performance.now();
				requestAnimationFrame(tick);
			}, 2000);
		}

		function installMobilePeekObserver(){
			const observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if(entry.isIntersecting){
						playMobilePeekOnce();
						observer.disconnect();
					}
				});
			}, { threshold: 0.4 });
			observer.observe(mapHost);
		}

		function setTrackFocus(trackKey){
			if(trackKey === activeTrackKey) return;
			activeTrackKey = trackKey;

			svg.querySelectorAll(".track-shape").forEach(node => {
				const isActive = trackKey && node.dataset.trackKey === trackKey;
				node.classList.toggle("track-hover", !!isActive);
				node.classList.toggle("track-muted", !!trackKey && !isActive);
			});

			svg.querySelectorAll(".track-arrow").forEach(node => {
				const isActive = trackKey && node.classList.contains(`track-arrow-${trackKey}`);
				if(isActive){
					const track = trackByKey.get(trackKey);
					if(track){
						node.style.setProperty("--track-glow", track.glow);
					}
				}
				node.classList.toggle("track-hover", !!isActive);
				node.classList.toggle("track-muted", !!trackKey && !isActive);
			});
		}

		function buildMobileUi(){
			if(mobileUi) return;

			const dragHint = document.createElement("div");
			dragHint.className = "career-mobile-drag-hint";
			dragHint.innerHTML = `
				<span class="career-mobile-drag-text">DRAG THE</span>
				<span class="material-symbols-outlined career-mobile-drag-icon" aria-hidden="true">swipe</span>
				<span class="career-mobile-drag-text">DIAGRAM</span>
			`;
			const panel = document.createElement("div");
			panel.className = "career-mobile-panel";
			const instruction = document.createElement("p");
			instruction.className = "career-mobile-instruction";
			instruction.textContent = "Click on a track and download the detailed PDF:";

			const picker = document.createElement("div");
			picker.className = "career-mobile-picker";

			const buttons = new Map();
			tracks.forEach(track => {
				const button = document.createElement("button");
				button.type = "button";
				button.className = "career-mobile-tab";
				button.dataset.trackKey = track.key;
				button.textContent = track.tabLabel;
				button.style.setProperty("--track-color", track.color);
				button.addEventListener("click", () => {
					window.open(track.href, "_blank", "noopener,noreferrer");
				});
				picker.appendChild(button);
				buttons.set(track.key, button);
			});

			panel.appendChild(instruction);
			panel.appendChild(picker);

			const disclaimer = mapHost.querySelector(".career-path-disclaimer");
			if(disclaimer && disclaimer.parentNode === mapHost){
				mapHost.insertBefore(dragHint, disclaimer);
			}else{
				mapHost.appendChild(dragHint);
			}

			mapHost.appendChild(panel);
			mobileUi = { panel, buttons };
		}

		function renderMobileCards(trackKey){
			if(!mobileUi) return;
			mobileUi.buttons.forEach(button => {
				button.classList.add("is-active");
				button.setAttribute("aria-pressed", "true");
			});
		}

		function installMobileDragPan(){
			let pointerDown = false;
			let dragged = false;
			let startX = 0;
			let startPanX = 0;

			mapHost.addEventListener("pointerdown", event => {
				if(!isMobile()) return;
				if(!event.target.closest("svg")) return;
				pointerDown = true;
				dragged = false;
				startX = event.clientX;
				startPanX = panX;
				mapHost.classList.add("is-dragging");
			});

			mapHost.addEventListener("pointermove", event => {
				if(!pointerDown || !isMobile()) return;
				const deltaX = event.clientX - startX;
				if(Math.abs(deltaX) > 4){
					dragged = true;
				}
				setPan(startPanX + deltaX);
			});

			const endDrag = () => {
				if(!pointerDown) return;
				pointerDown = false;
				mapHost.classList.remove("is-dragging");
				if(dragged){
					suppressTrackClick = true;
				}
			};

			mapHost.addEventListener("pointerup", endDrag);
			mapHost.addEventListener("pointercancel", endDrag);
			mapHost.addEventListener("pointerleave", endDrag);
		}

		function syncMobileHybridState(){
			if(isMobile()){
				mapHost.classList.add("is-mobile-hybrid");
				buildMobileUi();
				updateMobilePanBounds();
				renderMobileCards();
				setTrackFocus(null);
				return;
			}

			mapHost.classList.remove("is-mobile-hybrid");
			updateMobilePanBounds();
			setTrackFocus(null);
		}

		svg.addEventListener("mousemove", event => {
			if(isMobile()) return;
			const shape = event.target.closest(".track-shape");
			const trackKey = shape ? shape.dataset.trackKey : null;
			const track = trackKey ? trackByKey.get(trackKey) : null;
			setTrackFocus(trackKey);
			if(shape && track){
				tooltip.style.setProperty("--track-thumb-bg", track.color);
				if(tooltipImg){
					tooltipImg.src = track.thumb;
					tooltipImg.alt = `${track.label} PDF thumbnail`;
				}
				if(tooltipText){
					tooltipText.textContent = track.tooltipText || "Download detailed PDF";
				}
				tooltip.style.opacity = "1";
				tooltip.style.transform = "translateY(0)";
				tooltip.style.left = `${event.clientX + 14}px`;
				tooltip.style.top = `${event.clientY + 14}px`;
			}else{
				tooltip.style.opacity = "0";
				tooltip.style.transform = "translateY(4px)";
			}
		});

		svg.addEventListener("mouseleave", () => {
			if(isMobile()) return;
			setTrackFocus(null);
			tooltip.style.opacity = "0";
			tooltip.style.transform = "translateY(4px)";
		});

		svg.addEventListener("click", event => {
			const shape = event.target.closest(".track-shape");
			if(!shape) return;
			if(suppressTrackClick){
				suppressTrackClick = false;
				return;
			}

			const track = tracks.find(item => item.key === shape.dataset.trackKey);
			if(!track) return;

			if(isMobile()){
				window.open(track.href, "_blank", "noopener,noreferrer");
				return;
			}

			window.open(track.href, "_blank", "noopener,noreferrer");
		});

		const appearDelayStep = 95;
		let sequenceIndex = 0;
		const introNodes = [...svg.querySelectorAll('[fill="black"], [fill="#000"], [fill="#000000"], [fill="#000000FF"]')];

		introNodes.forEach(node => {
			node.classList.add("track-intro");
		});

		function getNodeVisualOrder(node){
			const box = node.getBBox();
			return {
				x: box.x,
				y: box.y
			};
		}

		if(introNodes.length){
			setTimeout(() => {
				introNodes.forEach(node => {
					node.classList.add("track-intro-visible");
				});
			}, sequenceIndex * appearDelayStep);
			sequenceIndex++;
		}

		tracks.forEach(track => {
			const orderedNodes = [...svg.querySelectorAll(`.track-${track.key}`)]
				.sort((a, b) => {
					const aPos = getNodeVisualOrder(a);
					const bPos = getNodeVisualOrder(b);
					const rowGap = Math.abs(aPos.y - bPos.y);
					if(rowGap > 6) return aPos.y - bPos.y;
					return aPos.x - bPos.x;
				});
			orderedTrackNodes.set(track.key, orderedNodes);

			orderedNodes.forEach(node => {
				setTimeout(() => {
					node.classList.add("track-visible");
					node.addEventListener("animationend", () => {
						node.classList.add("track-ready");
						node.classList.remove("track-visible");
					}, { once: true });
				}, sequenceIndex * appearDelayStep);
				sequenceIndex++;
			});
		});

		const allArrows = [...svg.querySelectorAll(".track-arrow")];
		if(allArrows.length){
			const revealAt = sequenceIndex * appearDelayStep;
			setTimeout(() => {
				allArrows.forEach(node => node.classList.add("track-visible"));
			}, revealAt);
			sequenceIndex++;
		}

		syncMobileHybridState();
		installMobileDragPan();
		installMobilePeekObserver();
		window.addEventListener("resize", syncMobileHybridState);
	});

})();
