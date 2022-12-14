<?php 
/* wait time simulation */
for($i=1; $i<90000; $i++) {
	$sim = ($i * 99999 ).' decimal '.($i * $i);
}
?>

<div id="folders-content">

	<div class="folder">
		<div class="rounded--x5 top-child center-text padding--x10 text--c3">
			<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
			<span class="symbol sym-bars symbol--c5"></span>
			PANEL
			<span class="symbol sym-bars symbol--c5"></span>
			<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
			<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
		</div>
		<div class="folder-content hidden">
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-leftside.php"><b>Left</b> Panel</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-rightside.php"><b>Right</b> Panel</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-doubleside.php"><b>Double</b> Panel</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-topside.php"><b>Top</b> Panel</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-bottomside.php"><b>Bottom</b> Panel</a>
		</div>
	</div>
	
	<div class="folder">
		<div class="rounded--x5 top-child center-text padding--x10 text--c3">
			<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
			<span class="symbol sym-bars symbol--c5"></span>
			SWEEP&nbsp;PANEL
			<span class="symbol sym-bars symbol--c5"></span>
			<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
			<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
		</div>
		<div class="folder-content hidden">
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-leftside.php"><b>Left</b> Panel with Sweep</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-rightside.php"><b>Right</b> Panel with Sweep</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-topside.php"><b>Top</b> Panel with Sweep</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-bottomside.php"><b>Bottom</b> Panel with Sweep</a>
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-center.php"><b>Center</b> Panel with Sweep</a>
		</div>
	</div>
	
	<div class="folder">
		<div class="rounded--x5 top-child center-text padding--x10 text--c3">
			<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
			<span class="symbol sym-bars symbol--c5"></span>
			SWEEP
			<span class="symbol sym-bars symbol--c5"></span>
			<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
			<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
		</div>
		<div class="folder-content hidden">
			<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep-chains.php"><b>Inline</b> Panel using Pure Sweep</a>
			<a class="bottom-child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep.php"><b>Right</b> Panel using Pure Sweep</a>
		</div>
	</div>

</div>